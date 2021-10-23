export const apps = {
    games: [
        {
            title: "Context Collapse",
            name: "context-collapse",
            description: "You're a cat in space shooting minecraft arrows. Can you get onto the leaderboard?",
            path: "/games/context-collapse",
            url: "/static/games/context-collapse",
            thumbnail: "/assets/images/context_collapse_thumbnail.png",
            mobileEnabled: false,
            id: 0
        },
        {
            title: "Matheroids",
            name: "matheroids",
            description: "Asteroids rain down, but you can destroy them with math!",
            path: "/games/matheroids",
            url: "/static/games/matheroids",
            thumbnail: "/assets/images/matheroids_thumbnail.png",
            mobileEnabled: true,
            id: 1
        }
    ],
    music: [
        {
            title: "Flippr",
            name: "flippr",
            description: "Negative harmony? No problem. Flip your scales here!",
            path: "/music/flippr",
            url: "/static/music/flippr",
            thumbnail: "/assets/images/flippr_thumbnail.png",
            mobileEnabled: true,
            id: 0
        },
        {
            title: "Spookr",
            name: "spookr",
            description: "Endless generative spooky music for your terror :)",
            path: "/music/spookr",
            url: "/static/music/spookr",
            thumbnail: "/assets/images/spookr_thumbnail.png",
            mobileEnabled: true,
            id: 1
        }
    ],
    math: [
        {
            title: "LaTeX Matrix Generator",
            name: "latex-matrix",
            description: "Linear Algebra papers just got so much easier!",
            url: "https://latex-matrix.netlify.app/",
            path: "/math/latex-matrix",
            thumbnail: "/assets/images/latex-matrix-thumbnail.png",
            mobileEnabled: true,
            id: 0
        }
    ],
    home: [
        {
            title: "Home",
            name: "home",
            description: null,
            path: "/",
            url: "/static/home",
            thumbnail: null,
            mobileEnabled: true,
            id: 0
        }
    ]
}   