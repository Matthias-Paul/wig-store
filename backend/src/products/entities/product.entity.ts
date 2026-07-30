import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  Index,
} from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { ProductVariant } from './product-variant.entity';
import { ProductStatus } from 'src/common/enums/product-status.enum';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text', array: true, default: [] })
  images: string[];

  @Column({ type: 'enum', enum: ProductStatus, default: ProductStatus.DRAFT })
  status: ProductStatus;

  @ManyToOne(() => Category, (category) => category.products, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @OneToMany(() => ProductVariant, (variant) => variant.product, {
    cascade: true,
  })
  variants: ProductVariant[];

  @Column({ type: 'int', nullable: true })
  discountPercentage: number | null;

  @Column({ type: 'timestamp', nullable: true })
  discountStartDate: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  discountEndDate: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
