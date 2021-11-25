import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Length, IsNotEmpty } from 'class-validator';
import * as bcrypt from 'bcryptjs';

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	@Length(4, 20)
	username: string;

	@Column()
	@Length(4, 24)
	password: string;

	@Column()
	@IsNotEmpty()
	role: string;

	hashPassword () {
		this.password = bcrypt.hashSync(this.password, 8);
	}

	checkPassword (unencryptedPassword: string) {
		return bcrypt.compareSync(unencryptedPassword, this.password);
	}
}
