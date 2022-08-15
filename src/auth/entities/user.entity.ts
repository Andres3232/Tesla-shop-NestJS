import { Product } from "src/products/entities";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {


    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', {
        unique: true,
      })
    email: string;

    @Column('text',{
      select: false
    })
    password: string;

    @Column('text')
    fullName: string;

    @Column('bool', {
        default: true

      })
    isActive: boolean;

    @Column('text', {
        array: true,
        default: ['users']
      })
    roles: string[];

    @OneToMany(
      ()=>Product,
      (product) => product.user
    )
    product: Product;

    @BeforeInsert()
    checkFieldsBeforeInstert(){
      this.email = this.email.toLowerCase();
    }

    @BeforeUpdate()
    checkFieldsBeforeUpdate(){
      this.checkFieldsBeforeInstert();
    }
}
