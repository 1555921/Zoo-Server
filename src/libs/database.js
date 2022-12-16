import mongoose from 'mongoose';
import chalk from 'chalk';

export default async () => {

    const url = process.env.DATABASE;
    console.log(chalk.green(`[MONGO] - Establish new connection with database`));

    try {
        await mongoose.connect(url);
        console.log(chalk.green(`[MONGO] - Connected to database`)); 
    } catch(err) {
        console.log(chalk.red(`[MONGO] - Cannot connect to database Exiting`));
        process.exit(1);
    }
    
}