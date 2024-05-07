import { set } from "mongoose";
import Menu from "../Models/menu.model.js";
import { errorHandler } from "../Middlewares/error.js"

export const create = async (req, res, next) =>{
console.log(req.user);
    if (!req.user.isAdmin) {
        return next(errorHandler(403, 'You are not allowed to create a menu'))
    }
    if (!req.body.title || !req.body.content) {
        return next(errorHandler(400, 'Please provide all required fields'))
    }
    const slug = req.body.title.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9-]/g,'');
    const newMenu= new Menu({
        ...req.body, slug, userId: req.user.id,
    });
    try {
        const savedMenu = await newMenu.save();
        res.status(201).json(savedMenu);
    } catch (error) {
        next(error);
    }
} ;

export const getMenu = async (req, res, next) =>{
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 20;
        const sortDirection = req.query.order === 'asc' ? 1 : -1;
        
        const menu = await Menu.find({
            ...(req.query.userId && { userId: req.query.userId }),
            ...(req.query.category && { category: req.query.category }),
            ...(req.query.slug && { slug: req.query.slug }),
            ...(req.query.menuntId && { _id: req.query.menuId }), // Coma agregada aquí
            ...(req.query.searchTerm && {
                $or:[
                    { title: { $regex: req.query.searchTerm, $options: 'i' } }, // Espacio eliminado después de 'i'
                    { content: { $regex: req.query.searchTerm, $options: 'i' } } // Espacio eliminado después de 'i'
                ]
            })
        }).sort({ update: sortDirection}).skip(startIndex).limit(limit);

        const totalMenu = await Menu.countDocuments();

        const now = new Date();

        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() -1,
            now.getDate()
        );

        const lastMonthMenu = await Menu.countDocuments({
            createdAt: {$gte: oneMonthAgo},
        });

        res.status(200).json({
            menu,
            totalMenu,
            lastMonthMenu,
        });

    } catch (error) {
        next(error)
    }
};

export const deletemenu = async (req, res, next) => {
    if (!req.user.isAdmin || req.user.id !== req.params.userId) {
        return next (errorHandler(403, 'You are not allowed to delete this menu'));
    }
    try {
        await Menu.findByIdAndDelete(req.params.menuId);
        res.status(200).json('The menu has been deleted');
    } catch (error) {
        next(error);
    }
};

export const updatemenu = async (req, res, next) => {
    if (!req.user.isAdmin || req.user.id !== req.params.userId) {
      return next(errorHandler(403, 'You are not allowed to update this menu'));
    }
    try {
      const updatedMenu = await Menu.findByIdAndUpdate(
        req.params.menuId,
        {
          $set: {
            title: req.body.title,
            content: req.body.content,
            category: req.body.category,
            image: req.body.image,
          },
        },
        { new: true }
      );
      res.status(200).json(updatedMenu);
    } catch (error) {
      next(error);
    }
  };