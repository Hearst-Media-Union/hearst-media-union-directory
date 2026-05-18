type MemberAreaInput = {
  brand: string
  location: string
}

const areaMappings: Record<string, Record<string, string>> = {
  '320 West 57th Street': {
    'Enthusiast Group': 'The Sheff - Floor 3',
    Books: 'The Sheff - Floor 3',
    'Best Products': 'The Sheff - Floor 3',
    'Consumer Revenue': 'The Sheff - Floor 3',
    Video: 'The Sheff - Floor 4',
    'Lifestyle Group': 'The Sheff - Floor 4',
    Delish: 'The Sheff - Floor 5',
    'House Beautiful': 'The Sheff - Floor 5',
  },
  '300 West 57th Street': {
    "Men's Health": 'New York - Floor 11',
    "Women's Health": 'New York - Floor 11',
    Visuals: 'New York - Floor 16',
    'Lifestyle Group': 'New York - Floor 16',
    Autos: 'New York - Floor 17',
    'Car & Driver': 'New York - Floor 17',
    'Food Network': 'New York - Floor 17',
    HGTV: 'New York - Floor 17',
    'Road & Track': 'New York - Floor 17',
    'The Pioneer Woman': 'New York - Floor 17',
    Cosmo: 'New York - Floor 22',
    Video: 'New York - Floor 22',
    Seventeen: 'New York - Floor 22',
    Elle: 'New York - Floor 24',
    'Oprah Daily': 'New York - Floor 24',
    'Elle Decor': 'New York - Floor 25',
    "Harper's Bazaar": 'New York - Floor 25',
    'Town & Country': 'New York - Floor 25',
    'Good Housekeeping Institute': 'New York - Floor 28/29',
    Esquire: 'New York - Floor 28/29',
    Prevention: 'New York - Floor 28/29',
    'Good Housekeeping': 'New York - Floor 28/29',
    'Edit Ops': 'New York - Floor 28/29',
  },
  'Birmingham, AL': {
    '*': 'Birmingham, AL',
  },
  'El Segundo, CA': {
    '*': 'El Segundo, CA',
  },
  'Easton, PA': {
    '*': 'Easton, PA',
  },
  'Ann Arbor, MI': {
    '*': 'Ann Arbor, MI',
  },
  'Royal Oak, MI': {
    '*': 'Royal Oak, MI',
  },
}

export function deriveMemberArea({ brand, location }: MemberAreaInput) {
  const locationMappings = areaMappings[location]

  if (!locationMappings) {
    return location
  }

  return locationMappings[brand] || locationMappings['*'] || location
}
