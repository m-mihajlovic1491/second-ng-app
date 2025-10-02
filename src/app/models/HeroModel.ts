export class HeroModel {
 id!: number;
  guid!: string;
  name!: string;
  legion?: number; 
  equippedArmor?: number; 
  equippedWeapon?: number; 
  health!: number;
  isDead!: boolean;
  backpack?: number; 
}