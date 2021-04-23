export const cleanAlterOperatorName = (name : string) => {
  const splitName = name.split(' ')
  if (splitName.length > 2) {
    return `${splitName[0]} Alter`
  } else {
    return name
  }
}

export interface ClassNameMapping {
  [oldClassName: string] : string
}

export const ClassNameMappings:  ClassNameMapping = {
  "WARRIOR": "Guard",
  "SNIPER": "Sniper",
  "TANK": "Defender",
  "MEDIC": "Medic",
  "SUPPORT": "Supporter",
  "CASTER": "Caster",
  "SPECIAL": "Specialist",
  "PIONEER": "Vanguard",
}

export const cleanLabel = (label : string) => {
  if (label === "MELEE") {
    return "Melee"
  } else if (label === "RANGED") {
    return "Ranged"
  }
  if (ClassNameMappings[label]) {
    return ClassNameMappings[label];
  }
  return label;
}