export default function getApps(){
    return {
        games: [
            {
                title: "Context Collapse",
                description: "You're a cat in space shooting minecraft arrows. Can you get onto the leaderboard?",
                path: "/games/context_collapse",
                staticPath: "/static/games/context_collapse",
                thumbnail: "/assets/images/context_collapse_thumbnail.png",
                mobileEnabled: false,
                id: 0
            },
            {
                title: "Matheroids",
                description: "Asteroids rain down, but you can destroy them with math!",
                path: "/games/matheroids",
                staticPath: "/static/games/matheroids",
                thumbnail: "/assets/images/matheroids_thumbnail.png",
                mobileEnabled: true,
                id: 1
            }
        ],
        musicTools: [
            {
                title: "Flippr",
                description: "Negative harmony? No problem. Flip your scales here!",
                path: "/music/flippr",
                staticPath: "/static/music/flippr",
                thumbnail: "/assets/images/flippr_thumbnail.png",
                mobileEnabled: true,
                id: 0
            },
            {
                title: "Spookr",
                description: "Endless generative spooky music for your terror :)",
                path: "/music/spookr",
                staticPath: "/static/music/spookr",
                thumbnail: "/assets/images/spookr_thumbnail.png",
                mobileEnabled: true,
                id: 1
            }
        ],
        mathTools: [
            {
                title: "LaTeX Matrix Generator",
                description: "Linear Algebra papers just got so much easier!",
                path: "/math/latex-matrix",
                staticPath: "/static/latex-matrix/",
                thumbnail: "/assets/images/latex-matrix-thumbnail.png",
                mobileEnabled: true,
                id: 0
            }
        ],
        home: [
            {
                title: "Home",
                description: null,
                path: "/",
                staticPath: "/static/home",
                thumbnail: null,
                mobileEnabled: true,
                id: 0
            }
        ]
    }
}