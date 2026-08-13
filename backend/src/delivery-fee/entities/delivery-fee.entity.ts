import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
} from 'typeorm';

@Entity('delivery_fees')
export class DeliveryFee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  state: string;

  @Column('decimal', { precision: 10, scale: 2 })
  fee: number;

  @Column({ default: true })
  isActive: boolean;

  @UpdateDateColumn()
  updatedAt: Date;
}
