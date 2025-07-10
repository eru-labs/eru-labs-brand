// File: src/lib/config.ts

export interface SiteConfig {
  metadata: {
    siteName: string;
    description: string;
    version: string;
  };
  hero: {
    featuredPublication: {
      zenodoUrl: string;
      title: string;
    };
  };
  github: {
    repositories: string[];
  };
  zenodo: {
    recordIds: string[];
  };
  publications: {
    zenodoIds: string[];
    featuredIds: string[];
  };
  openSourceProjects: Array<{
    sourceUrl: string;
    sourceType: 'github' | 'zenodo';
    category: 'research' | 'framework' | 'tools' | 'infrastructure';
    featured?: boolean;
    customDescription?: string;
    icon?: string;
    demoUrl?: string;
    paperUrl?: string;
    docsUrl?: string;
    githubUrl?: string;
  }>;
}

let cachedConfig: SiteConfig | null = null;

export async function loadConfig(): Promise<SiteConfig> {
  if (cachedConfig) {
    return cachedConfig;
  }

  try {
    const response = await fetch('/config.json');
    if (!response.ok) {
      throw new Error(`Failed to load config: ${response.statusText}`);
    }
    
    const config: SiteConfig = await response.json();
    cachedConfig = config;
    return config;
  } catch (error) {
    console.error('Failed to load configuration:', error);
    // Return default fallback config
    return getDefaultConfig();
  }
}

export function getDefaultConfig(): SiteConfig {
  return {
    metadata: {
      siteName: "ERU Labs",
      description: "Advanced AI research lab focused on emergent behaviors and multi-agent systems",
      version: "1.0.0"
    },
    hero: {
      featuredPublication: {
        zenodoUrl: "https://zenodo.org/records/15724141",
        title: "This is Your AI on Peer Pressure: An Observational Study of Inter-Agent Social Dynamics"
      }
    },
    github: {
      repositories: [
        "https://github.com/im-knots/ea-monorepo",
        "https://github.com/im-knots/the-academy",
        "https://github.com/im-knots/gvft"
      ]
    },
    zenodo: {
      recordIds: ["15724141"]
    },
    publications: {
      zenodoIds: ["15724141"],
      featuredIds: ["15724141"]
    },
    openSourceProjects: [
      {
        sourceUrl: "https://github.com/im-knots/the-academy",
        sourceType: "github",
        category: "infrastructure",
        featured: true,
        icon: "GraduationCap",
        customDescription: "Research platform for studying multi-agent AI interactions and peer pressure dynamics"
      },
      {
        sourceUrl: "https://github.com/im-knots/ea-monorepo",
        sourceType: "github",
        category: "infrastructure",
        icon: "Cpu",
        customDescription: "Modular AI orchestration platform for building complex agent-based workflows",
        docsUrl: "#docs"
      },
      {
        sourceUrl: "https://github.com/im-knots/gvft",
        sourceType: "github",
        category: "framework",
        icon: "Brain",
        customDescription: "Gestalt Vector Field Theory - Novel framework for evolving neural architectures using field theoretic concepts"
      },
      {
        sourceUrl: "https://zenodo.org/records/15724141",
        sourceType: "zenodo",
        category: "research",
        icon: "BotMessageSquare",
        customDescription: "This is Your AI on Peer Pressure: An Observational Study of Inter-Agent Social Dynamics",
        githubUrl: "https://github.com/im-knots/the-academy"
      }
    ]
  };
}

// Utility function to get icon components from string names
export function getIconComponent(iconName?: string): React.ComponentType<any> {
  const iconMap: Record<string, React.ComponentType<any>> = {
    GraduationCap: require('lucide-react').GraduationCap,
    Cpu: require('lucide-react').Cpu,
    Brain: require('lucide-react').Brain,
    BotMessageSquare: require('lucide-react').BotMessageSquare,
    Code: require('lucide-react').Code,
    Users: require('lucide-react').Users,
    Zap: require('lucide-react').Zap,
  };

  if (iconName && iconMap[iconName]) {
    return iconMap[iconName];
  }

  // Default icon
  return require('lucide-react').Code;
}