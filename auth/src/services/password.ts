import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

// 'scrypt' can be use to convert callback based 'scrypt' function to promise based, which is compactable with async await
const scryptAsync = promisify(scrypt);

export class PasswordManage {
	// static methods are method that we can access without creating an instance of the class
	static async toHash(password: string) {
		const salt = randomBytes(8).toString("hex");

		const buf = (await scryptAsync(password, salt, 64)) as Buffer;

		return `${buf.toString("hex")}.${salt}`;
	}

	static async compare(storedPassword: string, suppliedPassword: string) {
		const [hashedPassword, salt] = storedPassword.split(".");

		const buf = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;

		return buf.toString("hex") === hashedPassword;
	}
}
