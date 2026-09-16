import {pool} from '../db.ts';

export const createTables = async () =>{
   try{
     await pool.query(
        `CREATE TABLE IF NOT EXISTS users(
         user_id SERIAL PRIMARY KEY,
         name VARCHAR(100),
         email VARCHAR(255),
         address VARCHAR(255),
         phone_no INT,
         role VARCHAR(50)
        ); 
        CREATE TABLE IF NOT EXISTS restaurants(
         restaurant_id SERIAL PRIMARY KEY,
         name VARCHAR(100),
         address VARCHAR(255),
         phone_no INT
        ); 
        CREATE TABLE IF NOT EXISTS orders(
         order_id SERIAL PRIMARY KEY,
         user_id INT,
         restaurant_id INT,
         created_at TIMESTAMPTZ DEFAULT NOW(),
         status VARCHAR(50),
         FOREIGN KEY (user_id) REFERENCES users(user_id),
         FOREIGN KEY (restaurant_id) REFERENCES restaurants(restaurant_id)
        ); 
         CREATE TABLE IF NOT EXISTS order_items(
         order_id INT,
         item_id INT,
         quantity INT,
         price INT,
         FOREIGN KEY (order_id) REFERENCES orders(order_id),
         FOREIGN KEY (item_id) REFERENCES menu_items(item_id)
        ); 
        CREATE TABLE IF NOT EXISTS menu_items(
         item_id SERIAL PRIMARY KEY,
         restaurant_id INT,
         name VARCHAR(100),
         price DECIMAL(10, 2),
         FOREIGN KEY (restaurant_id) REFERENCES restaurants(restaurant_id)
        );`
     )
     await pool.query(`
       DO $$
       BEGIN
         IF EXISTS (
           SELECT 1
           FROM information_schema.columns
           WHERE table_schema = 'public'
             AND table_name = 'orders'
             AND column_name = 'created_at'
             AND data_type = 'date'
         ) THEN
           ALTER TABLE orders
             ALTER COLUMN created_at TYPE TIMESTAMPTZ
             USING (created_at::timestamp AT TIME ZONE 'Asia/Kolkata');
           ALTER TABLE orders
             ALTER COLUMN created_at SET DEFAULT NOW();
         END IF;
       END $$;
     `);
   }catch(error){
    console.error('Error creating tables:', error);
   }

}