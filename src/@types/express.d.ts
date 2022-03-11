declare namespace Express {
  export interface Request {
    user: {
      token?: string;
      id?: number;
    };
  }
}
