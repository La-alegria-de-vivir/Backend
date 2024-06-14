import mongoose from 'mongoose';

const db = async () => {
    try {
        await mongoose.connect(process.env.MONGO).then(() => {
            console.log('Mongodb is connected');
        }).catch((err) => {
            console.log(err);
        });
    } catch (error) {
        console.log(error)
    }
}
export default db