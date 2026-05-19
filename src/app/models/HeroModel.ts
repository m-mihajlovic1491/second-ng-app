export class HeroModel {
 id!: number;
  guid!: string;
  name!: string;
  legion?: number; 
  equippedArmor?: equippedWeapon; 
  equippedWeapon?: equippedArmor; 
  health!: number;
  isDead!: boolean;
  backpack?: number; 
}

class equippedWeapon {
  id!: number;
  name!: string;
  damage!: number;
}

class equippedArmor {
  id!: number;
  name!: string;
  defense!: number;
}