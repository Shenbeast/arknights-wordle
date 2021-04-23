export type NullableString = string | null
export type NullableStringArray = string[] | null
export type NullableNumber = number | null

export type RarityColor = [number, string]

export interface GrowthMaterial {
  id: string;
  count: number;
  type: string;
}

export interface OperatorDetails {
  id: string;
  name: string;
  rarity: number;
  nation: string;
  group: string;
  class: string;
  subclass: string;
  tags: string[];
  position: string;
  module: boolean;
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface UserOperatorSkills {
  s1: NullableNumber,
  s2: NullableNumber,
  s3: NullableNumber,
}
export interface UserOperatorGeneral {
  owned: boolean;
  favourite: boolean;
  potential: number;
  elitePhase: number;
  level: number;
  module: string;
  skills: UserOperatorSkills;
}

export interface OperatorGridOperator {
  user: UserOperatorGeneral
  id: string;
  name: string;
  rarity: number;
  class: string;
  skills: OperatorSkill[];
  potential: OperatorPotential[]
  phases: OperatorPhase[]
}

export interface OperatorFilter<T> {
  [filterProperty: string] : T[]
}

export interface OperatorMeta {
  [operatorId: string] : string[]
}

export interface ClassNameMapping {
  [oldClassName: string] : string
}


export interface OperatorFullDetailsList {
  [operatorId: string] : OperatorFullDetails
}

export interface OperatorFullDetails {
  id?: string,
  name: string,
  description: NullableString,
  canUseGeneralPotentialItem: boolean,
  potentialItemId: string,
  nationId: NullableString,
  groupId: NullableString,
  teamId: NullableString,
  displayNumber: NullableString,
  tokenKey: NullableString,
  appellation: string,
  position: string,
  tagList: NullableStringArray
  itemUsage: NullableString,
  itemDesc: NullableString,
  itemObtainApproach: NullableString,
  isNotObtainable: boolean,
  isSpChar: boolean,
  maxPotentialLevel: number,
  rarity: number,
  profession: string,
  subProfessionId: string,
  trait: OperatorTrait | null, // need to update this
  phases: OperatorPhase[],
  skills: OperatorSkill[],
  talents: OperatorTalent[] | null,
  potentialRanks: OperatorPotential[],
  favorKeyFrames: any,
  allSkillLvlup: OperatorNonMasterySkillUpgradeCost[],
}

export interface KeyValuePair {
  key: string,
  value: number,
}

export interface OperatorTrait {
  candidates: OperatorPotentialTrait[] | null
}

export interface OperatorPotentialTrait {
  unlockCondition: OperatorSkillUpgradeUnlockCondition,
  requiredPotentialRank: number,
  blackboard: KeyValuePair[],
  overrideDescripton: NullableString
  prefabKey: NullableString,
  rangeId: NullableString 
}

export interface OperatorPhase {
  characterPrefabKey: string,
  rangeId: NullableString,
  maxLevel: number,
  attributesKeyFrames: OperatorStats[],
  evolveCost: GrowthMaterial[] | null
}

export interface OperatorStats {
  level: number;
  data: OperatorBaseStats;
}

export interface OperatorBaseStats {
  maxHp: number,
  atk: number,
  def: number,
  magicResistance: number,
  cost: number,
  blockCnt: number,
  moveSpeed: number,
  attackSpeed: number,
  baseAttackTime: number,
  respawnTime: number,
  hpRecoveryPerSec: number,
  spRecoveryPerSec: number,
  maxDeployCount: number,
  maxDeckStackCnt: number,
  tauntLevel: number,
  massLevel: number,
  baseForceLevel: number,
  stunImmune: boolean,
  silenceImmune: boolean,
  sleepImmune: boolean,
  frozenImmune: boolean,
}

export interface OperatorSkill {
  skillId: string | null,
  overridePrefabKey: NullableString,
  overrideTokenKey: NullableString,
  levelUpCostCond: OperatorSkillUpgradeCost[]
  unlockCond: OperatorSkillUpgradeUnlockCondition
}

export interface OperatorSkillUpgradeCost {
  unlockCond: OperatorSkillUpgradeUnlockCondition
  lvlUpTime: number,
  levelUpCost: GrowthMaterial[] | null
}

export interface OperatorSkillUpgradeUnlockCondition {
  phase: number,
  level: number,
}

export interface OperatorTalent {
  candidates: OperatorPotentialTalent[] | null
}

export interface OperatorPotentialTalent {
  unlockCondition: OperatorSkillUpgradeUnlockCondition
  requiredPotentialRank: number,
  prefabKey: string,
  name: NullableString,
  description: NullableString,
  rangeId: NullableString,
  blackboard: KeyValuePair[]
}

export interface OperatorPotential {
  type: number,
  description: string,
  buff: any,
  equivalentCost: null
}

export interface OperatorNonMasterySkillUpgradeCost {
  unlockCond: OperatorSkillUpgradeUnlockCondition,
  lvlUpCost: GrowthMaterial[] | null,
}

export interface OperatorModuleDetails {
  phases: any[]
}

export interface OperatorModuleDetailsList {
  [moduleId: string] : string[]
}

export interface SkillDataList {
  [moduleId: string] : any
}