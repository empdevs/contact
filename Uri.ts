import "dotenv/config";
export class Uri {
  public static get rootUri(): string { return process.env["ROOT_URI"] || "" }
  public static get serverPort(): string { return process.env["PORT"] || "" }
  public static get dbUri(): string { return process.env["DB_URI"] || "" }
  public static get dbName(): string { return process.env["DB_NAME"] || "" }
  public static get secretKey(): string { return process.env["SECRET_KEY_TOKEN"] || "" }
  public static get secretKeyRefresh(): string { return process.env["SECRET_KEY_REFRESH"] || "" }
  public static get googleApiRootUri(): string { return process.env["GOOGLE_API_ROOT_URI"] || "" }
  public static get googleClientId(): string { return process.env["CLIENT_ID"] || "" }
  public static get googleClientSecret(): string { return process.env["CLIENT_SECRET"] || "" }
}