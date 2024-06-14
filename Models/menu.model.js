import mongoose from "mongoose";

const menuSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        image: {
            type: String,
            default: 'https://images.pexels.com/photos/64208/pexels-photo-64208.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        },
        alergenos: {
            type: String,
            required: false,
        },
        description: {
            type: String,
            required: true,
        },
        slug: {
            type: String,
            unique: true,
        }
    },{timestamps:true}
);

const Menu = mongoose.model('Menu', menuSchema);

export default Menu;