interface AuthResponse {
  status: string;
  data: {
    userId: number;
    access_token: string;
    userName: string;
    email: string;
  };
}
