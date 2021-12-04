import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class Image {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column('varchar', { length: 244 })
    uri: string;
}

export default {
	Entity: Image,
};
