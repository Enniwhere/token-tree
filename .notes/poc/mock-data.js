// Mock data structure for token tree visualization
const mockData = {
    prompt: "Once upon a time",
    tokens: [
        {
            text: "there",
            probability: 0.8,
            isMainPath: true,
            alternatives: [
                { text: "a", probability: 0.15, isMainPath: false },
                { text: "in", probability: 0.05, isMainPath: false }
            ]
        },
        {
            text: "was",
            probability: 0.9,
            isMainPath: true,
            alternatives: []
        },
        {
            text: "a",
            probability: 0.75,
            isMainPath: true,
            alternatives: [
                { text: "an", probability: 0.12, isMainPath: false },
                { text: "one", probability: 0.08, isMainPath: false },
                { text: "the", probability: 0.05, isMainPath: false }
            ]
        },
        {
            text: "young",
            probability: 0.6,
            isMainPath: true,
            alternatives: [
                { text: "little", probability: 0.25, isMainPath: false },
                { text: "small", probability: 0.15, isMainPath: false }
            ]
        },
        {
            text: "princess",
            probability: 0.85,
            isMainPath: true,
            alternatives: [
                { text: "girl", probability: 0.1, isMainPath: false },
                { text: "woman", probability: 0.05, isMainPath: false }
            ]
        },
        {
            text: "who",
            probability: 0.92,
            isMainPath: true,
            alternatives: [
                { text: "named", probability: 0.05, isMainPath: false },
                { text: "called", probability: 0.03, isMainPath: false }
            ]
        },
        {
            text: "lived",
            probability: 0.88,
            isMainPath: true,
            alternatives: [
                { text: "dwelt", probability: 0.06, isMainPath: false },
                { text: "resided", probability: 0.04, isMainPath: false },
                { text: "stayed", probability: 0.02, isMainPath: false }
            ]
        },
        {
            text: "in",
            probability: 0.95,
            isMainPath: true,
            alternatives: []
        },
        {
            text: "a",
            probability: 0.82,
            isMainPath: true,
            alternatives: [
                { text: "an", probability: 0.1, isMainPath: false },
                { text: "the", probability: 0.08, isMainPath: false }
            ]
        },
        {
            text: "castle",
            probability: 0.7,
            isMainPath: true,
            alternatives: [
                { text: "palace", probability: 0.18, isMainPath: false },
                { text: "tower", probability: 0.08, isMainPath: false },
                { text: "kingdom", probability: 0.04, isMainPath: false }
            ]
        }
    ]
};
