type MemberAreaInput = {
  brand: string
  location: string
}

const areaMappings: Record<string, Record<string, string>> = {
  'Ann Arbor MI 1350 Eisenhower Place': {
    '*': 'Ann Arbor, MI',
  },
  'Ann Arbor MI 1585 Eisenhower Place': {
    '*': 'Ann Arbor, MI',
  },
  'Birmingham AL 2901 Second Avenue South': {
    '*': 'Birmingham, AL',
  },
  'Easton PA 132 S. 3rd Street': {
    '*': 'Easton, PA',
  },
  'El Segundo CA 2151 East Grand Avenue': {
    '*': 'El Segundo, CA',
  },
  'El Segundo CA 90245 2004-K E. Park Place': {
    '*': 'El Segundo, CA',
  },
  'Los Angeles CA 6121 Santa Monica Blvd Suite 200': {
    '*': 'El Segundo, CA',
  },
  'New York NY 300 West 57th Street': {
    Autos: 'New York - Floor 17',
    'Car & Driver': 'New York - Floor 17',
    Cosmo: 'New York - Floor 22',
    Elle: 'New York - Floor 24',
    'Elle Décor': 'New York - Floor 25',
    'Elle Decor': 'New York - Floor 25',
    Esquire: 'New York - Floor 28/29',
    'Food Network': 'New York - Floor 17',
    'Good Housekeeping': 'New York - Floor 28/29',
    'Good Housekeeping Institute': 'New York - Floor 28/29',
    "Harper's Bazaar": 'New York - Floor 25',
    HGTV: 'New York - Floor 17',
    'Lifestyle Group': 'New York - Floor 16',
    "Men's Health": 'New York - Floor 11',
    'Oprah Daily': 'New York - Floor 24',
    Prevention: 'New York - Floor 28/29',
    Seventeen: 'New York - Floor 22',
    'The Pioneer Woman': 'New York - Floor 17',
    'Town & Country': 'New York - Floor 25',
    Video: 'New York - Floor 22',
    Visuals: 'New York - Floor 16',
    "Women's Health": 'New York - Floor 11',
  },
  'New York NY 320 West 57th Street': {
    'Best Products': 'The Sheff - Floor 3',
    Books: 'The Sheff - Floor 3',
    'Consumer Revenue': 'The Sheff - Floor 3',
    Delish: 'The Sheff - Floor 5',
    'Enthusiast Group': 'The Sheff - Floor 3',
    'House Beautiful': 'The Sheff - Floor 5',
    'Lifestyle Group': 'The Sheff - Floor 4',
    Video: 'The Sheff - Floor 4',
  },
  'Royal Oak MI 120 E. Hudson': {
    '*': 'Royal Oak, MI',
  },
  'San Francisco CA 901 Mission Street': {
    '*': 'El Segundo, CA',
  },
  'Santa Monica CA 3000 Ocean Park Blvd': {
    '*': 'El Segundo, CA',
  },
  'Santa Monica CA 3420 Ocean Park Blvd': {
    '*': 'El Segundo, CA',
  },
}

export function deriveMemberArea({ brand, location }: MemberAreaInput) {
  const locationMappings = areaMappings[location]

  if (!locationMappings) {
    return location
  }

  return locationMappings[brand] || locationMappings['*'] || location
}
