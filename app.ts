import express from 'express';
import { createConnection } from 'typeorm';
import bodyparser from 'body-parser';
import cookieParser from 'cookie-parser';
import userRoute from './routes/userRoute';
import pageRoute from './routes/pageRoute';
import User from './entities/User';

const app = express();

// Database connection
const main = async () => {
  try {
    await createConnection({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '123456789',
      database: 'jwt-test',
      entities: [User],
      synchronize: true,
    });
    app.set('view engine', 'ejs');
    // Middlewares
    app.use(bodyparser.urlencoded({ extended: false }));
    app.use(bodyparser.json());
    app.use(cookieParser());
    app.use(express.static('public'));
    // Routes
    app.get('/', pageRoute);
    app.use('/user', userRoute);
    app.listen(process.env.PORT || 3000, () => {
      // tslint:disable-next-line:no-console
      console.log('App is live');
    });
  } catch (error) {
    throw error;
  }
};

main();
