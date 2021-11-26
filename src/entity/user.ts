import { Entity, Column, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Length } from 'class-validator';
import bcrypt from 'bcryptjs';

@Entity()
@Unique(['username'])
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	@Length(4, 20)
	username: string;

	@Column()
	@Length(4, 100)
	password: string;

	@Column({ default: 'user' })
	role: string

	hashPassword () {
		this.password = bcrypt.hashSync(this.password, 8);
	}

	checkPassword (unencryptedPassword: string) {
		return bcrypt.compareSync(unencryptedPassword, this.password);
	}
}
