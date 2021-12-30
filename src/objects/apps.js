export const apps = {
    home: [
        {
            title: "Home",
            name: "home",
            description: null,
            path: "/home",
            url: "/static/home",
            category: "home",
            thumbnail: null,
            mobileEnabled: true,
            needsForeheadOnMobile: false,
        }
    ],
    music: [
        {
            title: "Realisr 2",
            name: "realisr2",
            description: "Complete reboot of Realisr, with way more features and performance!",
            path: "/music/realisr2",
            url: "https://realisr2.netlify.app",
            category: "music",
            thumbnail: "/assets/images/realisr2-thumbnail.png",
            mobileEnabled: true,
            needsForeheadMdDown: true
        },
        {
            title: "Flippr",
            name: "flippr",
            description: "Negative harmony? No problem. Flip your scales here!",
            path: "/music/flippr",
            url: "https://flippr.netlify.app",
            category: "music",
            thumbnail: "/assets/images/flippr_thumbnail.png",
            mobileEnabled: true,
            needsForeheadMdDown: false,
        },
        {
            title: "Spookr",
            name: "spookr",
            description: "Endless generative spooky music for your terror :)",
            path: "/music/spookr",
            url: "https://spookr.netlify.app",
            category: "music",
            thumbnail: "/assets/images/spookr_thumbnail.png",
            mobileEnabled: true,
            needsForeheadMdDown: false,
        }
    ],
    games: [
        {
            title: "Context Collapse",
            name: "context-collapse",
            description: "You're a cat in space shooting minecraft arrows. Can you get onto the leaderboard?",
            path: "/games/context-collapse",
            url: "https://context-collapse.netlify.app",
            category: "games",
            thumbnail: "/assets/images/context_collapse_thumbnail.png",
            mobileEnabled: false,
            needsForeheadMdDown: true,
        },
        {
            title: "Matheroids",
            name: "matheroids",
            description: "Asteroids rain down, but you can destroy them with math!",
            path: "/games/matheroids",
            url: "https://matheroids.netlify.app",
            category: "games",
            thumbnail: "/assets/images/matheroids_thumbnail.png",
            mobileEnabled: true,
            needsForeheadMdDown: true,
        }
    ],
    math: [
        {
            title: "LaTeX Matrix Generator",
            name: "latex-matrix",
            description: "Linear Algebra papers just got so much easier!",
            url: "https://latex-matrix.netlify.app/",
            path: "/math/latex-matrix",
            category: "math",
            thumbnail: "/assets/images/latex-matrix-thumbnail.png",
            mobileEnabled: true,
            needsForeheadMdDown: true,
        }
    ]
}   