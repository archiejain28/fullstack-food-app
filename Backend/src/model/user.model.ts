import { pool } from "../db.ts";

class UserModel {
  createUser = async (user: any) => {
    try {
      const query = `INSERT INTO users (name, email,address,phone_no, role) Values ($1, $2, $3, $4,$5) Returning *`;
      const response = await pool.query(query, [
        user.name,
        user.email,
        user.address ?? "",
        user.phone_no ?? null,
        user.role,
      ]);
      return response.rows[0];
    } catch (error) {
      throw error;
    }
  };

  fetchAllUsers = async () => {
    try {
      const query = `SELECT * FROM users ORDER BY user_id ASC`;
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      throw error;
    }
  };

  fetchUserByUserId = async (id: number) => {
    try {
      const query = `SELECT 1 FROM users where user_id=${id}`;
      const result = await pool.query(query);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  };

  fetchUserByEmail = async (email: string) => {
    try {
      const query = `SELECT * FROM users where email=$1`;
      const result = await pool.query(query, [email]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  };

  updateUserField = async (
    address?: string,
    phone_no?: string,
    newRole?: string,
    email?: string,
    id?: string,
  ) => {
    try {
      const whereClause = id ? "user_id = $5" : "email = $4";

      const query = `UPDATE users 
      SET address = COALESCE(NULLIF($1::text, ''), address),
      phone_no = COALESCE(NULLIF($2::text, ''), phone_no),
      role = COALESCE(NULLIF($3::text, ''), role)
      WHERE ${whereClause}
      RETURNING *`;

      const result = await pool.query(query, [
        address,
        phone_no,
        newRole,
        email,
        id,
      ]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  };

  completeUserProfile = async (
    email: string,
    name: string,
    address: string,
    phone_no: string,
    role: string,
  ) => {
    try {
      const query = `UPDATE users
        SET name = $1,
            address = $2,
            phone_no = $3,
            role = $4
        WHERE email = $5
        RETURNING *`;

      const result = await pool.query(query, [
        name,
        address,
        phone_no,
        role,
        email,
      ]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  };
}

export default UserModel;
