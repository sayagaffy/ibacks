export class JubelioClient {
  private static instance: JubelioClient;
  private token: string | null = null;
  private tokenExpiresAt: number = 0;

  private constructor() {}

  public static getInstance(): JubelioClient {
    if (!JubelioClient.instance) {
      JubelioClient.instance = new JubelioClient();
    }
    return JubelioClient.instance;
  }

  private async authenticate(): Promise<string> {
    // If token exists and is valid (with 5 minutes buffer), return it
    if (this.token && Date.now() < this.tokenExpiresAt - 5 * 60 * 1000) {
      return this.token;
    }

    const email = process.env.JUBELIO_EMAIL;
    const password = process.env.JUBELIO_PASSWORD;

    if (!email || !password) {
      throw new Error("JUBELIO_EMAIL or JUBELIO_PASSWORD is not set in environment variables.");
    }

    try {
      const response = await fetch("https://api2.jubelio.com/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error(`Jubelio Auth Failed: ${response.statusText}`);
      }

      const data = await response.json();
      this.token = data.token;
      
      // Jubelio token typically expires in 24 hours, but we set a safe limit (e.g. 12 hours)
      this.tokenExpiresAt = Date.now() + 12 * 60 * 60 * 1000; 

      return this.token!;
    } catch (error) {
      console.error("Error authenticating against Jubelio:", error);
      throw error;
    }
  }

  public async get<T>(path: string, params?: Record<string, string>): Promise<T> {
    const token = await this.authenticate();
    
    // Construct URL with query params
    const url = new URL(`https://api2.jubelio.com${path}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      // Ensure Next.js caches these heavy responses safely, revalidate per 1 hour maybe
      next: { revalidate: 3600 } 
    });

    if (!response.ok) {
      throw new Error(`Jubelio API GET ${path} failed: ${response.statusText}`);
    }

    return response.json() as Promise<T>;
  }
}

export const jubelio = JubelioClient.getInstance();
