(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["static/chunks/_365791._.js", {

"[project]/hooks/useShoeData.ts [app-client] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, k: __turbopack_refresh__ }) => (() => {
"use strict";

__turbopack_esm__({
    "useShoeData": ()=>useShoeData
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/utils/constants.ts [app-client] (ecmascript)");
"__TURBOPACK__ecmascript__hoisting__location__";
var _s = __turbopack_refresh__.signature();
"use client";
;
;
let cachedData = null;
function useShoeData() {
    _s();
    const [data, setData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(cachedData || {
        shoes: [],
        embeddings: null,
        clusters: null,
        meta: null,
        loading: true,
        error: null
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (cachedData) {
            setData(cachedData);
            return;
        }
        async function load() {
            try {
                const [shoesRes, embRes, clustRes, metaRes] = await Promise.all([
                    fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BASE_PATH"]}/data/shoes.json`),
                    fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BASE_PATH"]}/data/embeddings.json`),
                    fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BASE_PATH"]}/data/clusters.json`),
                    fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BASE_PATH"]}/data/meta.json`)
                ]);
                const shoes = (await shoesRes.json()).map((s)=>({
                        ...s,
                        pros: s.pros || [],
                        cons: s.cons || []
                    }));
                const embeddings = await embRes.json();
                const clusters = await clustRes.json();
                const meta = await metaRes.json();
                cachedData = {
                    shoes,
                    embeddings,
                    clusters,
                    meta,
                    loading: false,
                    error: null
                };
                setData(cachedData);
            } catch (err) {
                setData((prev)=>({
                        ...prev,
                        loading: false,
                        error: err instanceof Error ? err.message : "Failed to load data"
                    }));
            }
        }
        load();
    }, []);
    return data;
}
_s(useShoeData, "nIwD2fcEZO4072Jh+mTQsn7E1qY=");

})()),
"[project]/utils/archetype.ts [app-client] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, k: __turbopack_refresh__ }) => (() => {
"use strict";

__turbopack_esm__({
    "classifyArchetype": ()=>classifyArchetype,
    "computePreferenceVector": ()=>computePreferenceVector,
    "getArchetypeWeights": ()=>getArchetypeWeights,
    "getInsights": ()=>getInsights
});
const ARCHETYPE_WEIGHTS = {
    cushion_chaser: {
        weight: 1,
        stack_height: 3,
        drop: 1,
        midsole_softness: 3,
        flexibility: 1,
        width: 1,
        energy_return: 2,
        traction: 1
    },
    speed_demon: {
        weight: 3,
        stack_height: 1,
        drop: 1,
        midsole_softness: 1,
        flexibility: 2,
        width: 1,
        energy_return: 3,
        traction: 1
    },
    injury_guardian: {
        weight: 1,
        stack_height: 2,
        drop: 2,
        midsole_softness: 2,
        flexibility: 1,
        width: 2,
        energy_return: 1,
        traction: 1
    },
    trail_explorer: {
        weight: 1,
        stack_height: 1,
        drop: 1,
        midsole_softness: 1,
        flexibility: 1,
        width: 2,
        energy_return: 1,
        traction: 3
    },
    all_rounder: {
        weight: 1,
        stack_height: 1,
        drop: 1,
        midsole_softness: 1,
        flexibility: 1,
        width: 1,
        energy_return: 1,
        traction: 1
    }
};
function classifyArchetype(profile) {
    const { weeklyMileage, pace, terrain, injuries, comfortSpeed } = profile;
    // Trail dominates if selected
    if (terrain === "trail") return "trail_explorer";
    // Injury guardian if any injuries flagged
    if (injuries.length > 0 && !injuries.includes("none")) return "injury_guardian";
    // Speed demon: fast pace + speed preference
    if (pace < 7.5 && comfortSpeed > 60) return "speed_demon";
    // Cushion chaser: high mileage + comfort preference
    if (weeklyMileage > 40 && comfortSpeed < 40) return "cushion_chaser";
    // Speed-leaning
    if (comfortSpeed > 65) return "speed_demon";
    // Comfort-leaning
    if (comfortSpeed < 35) return "cushion_chaser";
    return "all_rounder";
}
function getArchetypeWeights(archetype) {
    return ARCHETYPE_WEIGHTS[archetype];
}
function computePreferenceVector(profile) {
    const { weeklyMileage, pace, comfortSpeed, injuries } = profile;
    // Normalize inputs to [0, 1]
    const mileageNorm = Math.min(weeklyMileage / 100, 1);
    const paceNorm = 1 - (pace - 5) / 8; // faster pace = higher value
    const speedPref = comfortSpeed / 100; // 0 = comfort, 1 = speed
    // Compute preference for each feature
    const weight = 0.3 + speedPref * 0.5; // speed lovers want light (high = light after inversion)
    const stack_height = 0.5 + mileageNorm * 0.3 - speedPref * 0.2;
    const drop = 0.5; // neutral default
    const midsole_softness = 0.5 + (1 - speedPref) * 0.3 + mileageNorm * 0.1;
    const flexibility = 0.3 + speedPref * 0.4;
    const width = 0.5;
    const energy_return = 0.4 + speedPref * 0.3 + paceNorm * 0.2;
    const traction = profile.terrain === "trail" ? 0.9 : 0.3;
    const prefs = {
        weight,
        stack_height,
        drop,
        midsole_softness,
        flexibility,
        width,
        energy_return,
        traction
    };
    // Injury adjustments
    if (injuries.includes("plantar_fasciitis")) {
        prefs.stack_height = Math.min(prefs.stack_height + 0.2, 1);
        prefs.midsole_softness = Math.min(prefs.midsole_softness + 0.15, 1);
    }
    if (injuries.includes("shin_splints")) {
        prefs.midsole_softness = Math.min(prefs.midsole_softness + 0.2, 1);
        prefs.drop = Math.min(prefs.drop + 0.15, 1);
    }
    if (injuries.includes("knee")) {
        prefs.stack_height = Math.min(prefs.stack_height + 0.15, 1);
        prefs.flexibility = Math.max(prefs.flexibility - 0.1, 0);
    }
    if (injuries.includes("achilles")) {
        prefs.drop = Math.min(prefs.drop + 0.2, 1);
        prefs.midsole_softness = Math.min(prefs.midsole_softness + 0.1, 1);
    }
    // Clamp all to [0, 1]
    for (const key of Object.keys(prefs)){
        prefs[key] = Math.max(0, Math.min(1, prefs[key]));
    }
    return prefs;
}
function getInsights(profile, archetype, prefs) {
    const insights = [];
    // Optimal stack range (denormalize: typical range 20-45mm)
    const stackMin = Math.round(20 + prefs.stack_height * 20);
    const stackMax = Math.min(stackMin + 8, 45);
    insights.push({
        label: "Optimal Stack",
        value: `${stackMin}–${stackMax}mm`
    });
    // Weight tolerance
    const maxWeight = Math.round(350 - prefs.weight * 150);
    insights.push({
        label: "Max Weight",
        value: `${maxWeight}g`
    });
    // Drop preference
    const dropPref = prefs.drop > 0.6 ? "High (8–12mm)" : prefs.drop > 0.4 ? "Medium (4–8mm)" : "Low (0–4mm)";
    insights.push({
        label: "Drop Preference",
        value: dropPref
    });
    // Cushioning level
    const cushion = prefs.midsole_softness > 0.7 ? "Maximum" : prefs.midsole_softness > 0.4 ? "Moderate" : "Minimal";
    insights.push({
        label: "Cushioning",
        value: cushion
    });
    // Injury warnings
    if (profile.injuries.includes("plantar_fasciitis")) {
        insights.push({
            label: "Injury Flag",
            value: "Avoid minimal cushioning",
            warning: true
        });
    }
    if (profile.injuries.includes("shin_splints")) {
        insights.push({
            label: "Injury Flag",
            value: "Prioritize shock absorption",
            warning: true
        });
    }
    if (profile.injuries.includes("knee")) {
        insights.push({
            label: "Injury Flag",
            value: "Extra stability recommended",
            warning: true
        });
    }
    return insights;
}

})()),
"[project]/hooks/useRunnerProfile.ts [app-client] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, k: __turbopack_refresh__ }) => (() => {
"use strict";

__turbopack_esm__({
    "useRunnerProfile": ()=>useRunnerProfile
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$archetype$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/utils/archetype.ts [app-client] (ecmascript)");
"__TURBOPACK__ecmascript__hoisting__location__";
"use client";
;
;
const DEFAULT_PROFILE = {
    weeklyMileage: 25,
    pace: 9.0,
    terrain: "road",
    injuries: [],
    comfortSpeed: 50
};
function computeDerived(profile) {
    const archetype = (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$archetype$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["classifyArchetype"])(profile);
    const preferenceVector = (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$archetype$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["computePreferenceVector"])(profile);
    const insights = (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$archetype$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getInsights"])(profile, archetype, preferenceVector);
    return {
        archetype,
        preferenceVector,
        insights
    };
}
const initialDerived = computeDerived(DEFAULT_PROFILE);
const useRunnerProfile = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])((set)=>({
        profile: DEFAULT_PROFILE,
        ...initialDerived,
        currentShoe: null,
        currentShoeFeedback: "",
        setProfile: (updates)=>set((state)=>{
                const newProfile = {
                    ...state.profile,
                    ...updates
                };
                return {
                    profile: newProfile,
                    ...computeDerived(newProfile)
                };
            }),
        setCurrentShoe: (shoe)=>set({
                currentShoe: shoe
            }),
        setCurrentShoeFeedback: (feedback)=>set({
                currentShoeFeedback: feedback
            }),
        reset: ()=>set({
                profile: DEFAULT_PROFILE,
                ...computeDerived(DEFAULT_PROFILE),
                currentShoe: null,
                currentShoeFeedback: ""
            })
    }));

})()),
"[project]/types/index.ts [app-client] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, k: __turbopack_refresh__ }) => (() => {
"use strict";

__turbopack_esm__({
    "ARCHETYPE_DESCRIPTIONS": ()=>ARCHETYPE_DESCRIPTIONS,
    "ARCHETYPE_LABELS": ()=>ARCHETYPE_LABELS,
    "FEATURE_KEYS": ()=>FEATURE_KEYS,
    "FEATURE_LABELS": ()=>FEATURE_LABELS
});
const FEATURE_KEYS = [
    "weight",
    "stack_height",
    "drop",
    "midsole_softness",
    "flexibility",
    "width",
    "energy_return",
    "traction"
];
const FEATURE_LABELS = {
    weight: "Weight",
    stack_height: "Stack Height",
    drop: "Drop",
    midsole_softness: "Cushioning",
    flexibility: "Flexibility",
    width: "Width",
    energy_return: "Energy Return",
    traction: "Traction"
};
const ARCHETYPE_LABELS = {
    cushion_chaser: "Cushion Chaser",
    speed_demon: "Speed Demon",
    injury_guardian: "Injury Guardian",
    trail_explorer: "Trail Explorer",
    all_rounder: "All-Rounder"
};
const ARCHETYPE_DESCRIPTIONS = {
    cushion_chaser: "You prioritize maximum cushioning and comfort for high-mileage running.",
    speed_demon: "You want lightweight, responsive shoes that help you go fast.",
    injury_guardian: "Your shoe choice is guided by injury prevention and stability needs.",
    trail_explorer: "You need grip, durability, and protection for off-road terrain.",
    all_rounder: "You want a versatile shoe that handles a variety of runs well."
};

})()),
"[project]/utils/scoring.ts [app-client] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, k: __turbopack_refresh__ }) => (() => {
"use strict";

__turbopack_esm__({
    "rankShoes": ()=>rankShoes,
    "scoreShoe": ()=>scoreShoe
});
var __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/types/index.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$archetype$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/utils/archetype.ts [app-client] (ecmascript)");
"__TURBOPACK__ecmascript__hoisting__location__";
;
;
function scoreShoe(shoe, prefs, archetype, userTerrain) {
    const weights = (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$archetype$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getArchetypeWeights"])(archetype);
    // 1. Weighted feature similarity
    let featureScore = 0;
    let totalWeight = 0;
    const featureContributions = [];
    for (const f of __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FEATURE_KEYS"]){
        const diff = Math.abs(shoe.features[f] - prefs[f]);
        const match = 1 - diff;
        const weighted = weights[f] * match;
        featureScore += weighted;
        totalWeight += weights[f];
        featureContributions.push({
            feature: f,
            contribution: weighted / totalWeight,
            diff
        });
    }
    featureScore /= totalWeight;
    // 2. Terrain compatibility
    let terrainMatch = 1.0;
    if (userTerrain === "trail" && shoe.tags.terrain !== "trail") {
        terrainMatch = 0.3;
    } else if (userTerrain === "road" && shoe.tags.terrain !== "road") {
        terrainMatch = 0.4;
    }
    // "mixed" accepts both
    // 3. Price factor (gentle — max 10% penalty for expensive shoes)
    const priceFactor = shoe.price ? 1.0 - 0.1 * Math.min(shoe.price / 300, 1) : 0.95;
    // Final score
    const score = featureScore * terrainMatch * priceFactor;
    // Top contributing factors for explanation
    featureContributions.sort((a, b)=>b.contribution - a.contribution);
    const topFactors = featureContributions.slice(0, 3).map(({ feature, contribution, diff })=>{
        const matchPct = Math.round((1 - diff) * 100);
        return {
            feature,
            contribution,
            explanation: `${__TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FEATURE_LABELS"][feature]}: ${matchPct}% match with your preference`
        };
    });
    return {
        ...shoe,
        score,
        breakdown: {
            featureScore,
            terrainMatch,
            priceFactor,
            topFactors
        }
    };
}
function rankShoes(shoes, prefs, archetype, terrain) {
    return shoes.map((shoe)=>scoreShoe(shoe, prefs, archetype, terrain)).sort((a, b)=>b.score - a.score);
}

})()),
"[project]/hooks/useRecommendations.ts [app-client] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, k: __turbopack_refresh__ }) => (() => {
"use strict";

__turbopack_esm__({
    "useRecommendations": ()=>useRecommendations
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useShoeData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/hooks/useShoeData.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useRunnerProfile$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/hooks/useRunnerProfile.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$scoring$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/utils/scoring.ts [app-client] (ecmascript)");
"__TURBOPACK__ecmascript__hoisting__location__";
var _s = __turbopack_refresh__.signature();
"use client";
;
;
;
;
function useRecommendations() {
    _s();
    const { shoes, loading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useShoeData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useShoeData"])();
    const { preferenceVector, archetype, profile } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useRunnerProfile$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRunnerProfile"])();
    const recommendations = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (shoes.length === 0) return [];
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$scoring$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["rankShoes"])(shoes, preferenceVector, archetype, profile.terrain);
    }, [
        shoes,
        preferenceVector,
        archetype,
        profile.terrain
    ]);
    return {
        recommendations,
        loading
    };
}
_s(useRecommendations, "3qRySZceGNkPQGjv5AxnJHoYYQA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useShoeData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useShoeData"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useRunnerProfile$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRunnerProfile"]
    ];
});

})()),
"[project]/hooks/useShoeDetails.ts [app-client] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, k: __turbopack_refresh__ }) => (() => {
"use strict";

__turbopack_esm__({
    "useShoeDetails": ()=>useShoeDetails
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/utils/constants.ts [app-client] (ecmascript)");
"__TURBOPACK__ecmascript__hoisting__location__";
var _s = __turbopack_refresh__.signature();
"use client";
;
;
let cachedDetails = null;
function useShoeDetails() {
    _s();
    const [details, setDetails] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(cachedDetails || {});
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(!cachedDetails);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (cachedDetails) return;
        fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BASE_PATH"]}/data/shoes-detail.json`).then((r)=>r.json()).then((data)=>{
            cachedDetails = data;
            setDetails(data);
            setLoading(false);
        }).catch(()=>setLoading(false));
    }, []);
    return {
        details,
        loading
    };
}
_s(useShoeDetails, "7Xo4db/Nd4nerfexTbVgBGU4sO8=");

})()),
"[project]/components/Panel.tsx [app-client] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, k: __turbopack_refresh__ }) => (() => {
"use strict";

__turbopack_esm__({
    "default": ()=>Panel
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
"__TURBOPACK__ecmascript__hoisting__location__";
;
function Panel({ children, className = "", title }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `border border-border bg-bg-panel rounded-xl p-6 shadow-sm ${className}`,
        children: [
            title && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: "text-xs text-text-secondary font-semibold mb-4",
                children: title
            }, void 0, false, {
                fileName: "[project]/components/Panel.tsx",
                lineNumber: 15,
                columnNumber: 9
            }, this),
            children
        ]
    }, void 0, true, {
        fileName: "[project]/components/Panel.tsx",
        lineNumber: 13,
        columnNumber: 5
    }, this);
}
_c = Panel;
var _c;
__turbopack_refresh__.register(_c, "Panel");

})()),
"[project]/components/SpiderChart.tsx [app-client] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, k: __turbopack_refresh__ }) => (() => {
"use strict";

__turbopack_esm__({
    "default": ()=>SpiderChart
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/types/index.ts [app-client] (ecmascript)");
"__TURBOPACK__ecmascript__hoisting__location__";
;
var _s = __turbopack_refresh__.signature();
"use client";
;
;
function SpiderChart({ data, features, size = 300 }) {
    _s();
    const center = size / 2;
    const radius = size * 0.38;
    const levels = 4;
    const angleSlice = Math.PI * 2 / features.length;
    const getPoint = (featureIndex, value)=>{
        const angle = angleSlice * featureIndex - Math.PI / 2;
        return [
            center + Math.cos(angle) * radius * value,
            center + Math.sin(angle) * radius * value
        ];
    };
    const gridRings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        return Array.from({
            length: levels
        }, (_, i)=>{
            const r = radius * (i + 1) / levels;
            const points = features.map((_, fi)=>{
                const angle = angleSlice * fi - Math.PI / 2;
                return `${center + Math.cos(angle) * r},${center + Math.sin(angle) * r}`;
            }).join(" ");
            return points;
        });
    }, [
        features,
        radius,
        levels,
        angleSlice,
        center
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col items-center",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                width: size,
                height: size,
                viewBox: `0 0 ${size} ${size}`,
                children: [
                    gridRings.map((points, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polygon", {
                            points: points,
                            fill: "none",
                            stroke: "#E5E7EB",
                            strokeWidth: 0.5
                        }, `ring-${i}`, false, {
                            fileName: "[project]/components/SpiderChart.tsx",
                            lineNumber: 45,
                            columnNumber: 11
                        }, this)),
                    features.map((_, i)=>{
                        const [x, y] = getPoint(i, 1);
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                            x1: center,
                            y1: center,
                            x2: x,
                            y2: y,
                            stroke: "#E5E7EB",
                            strokeWidth: 0.5
                        }, `axis-${i}`, false, {
                            fileName: "[project]/components/SpiderChart.tsx",
                            lineNumber: 58,
                            columnNumber: 13
                        }, this);
                    }),
                    data.map((d, di)=>{
                        const points = features.map((f, fi)=>getPoint(fi, d.values[f]).join(",")).join(" ");
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polygon", {
                                    points: points,
                                    fill: d.color,
                                    fillOpacity: 0.12,
                                    stroke: d.color,
                                    strokeWidth: 1.5
                                }, void 0, false, {
                                    fileName: "[project]/components/SpiderChart.tsx",
                                    lineNumber: 77,
                                    columnNumber: 15
                                }, this),
                                features.map((f, fi)=>{
                                    const [x, y] = getPoint(fi, d.values[f]);
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                        cx: x,
                                        cy: y,
                                        r: 3,
                                        fill: d.color
                                    }, fi, false, {
                                        fileName: "[project]/components/SpiderChart.tsx",
                                        lineNumber: 87,
                                        columnNumber: 19
                                    }, this);
                                })
                            ]
                        }, di, true, {
                            fileName: "[project]/components/SpiderChart.tsx",
                            lineNumber: 76,
                            columnNumber: 13
                        }, this);
                    }),
                    features.map((f, i)=>{
                        const angle = angleSlice * i - Math.PI / 2;
                        const labelRadius = radius + 24;
                        const x = center + Math.cos(angle) * labelRadius;
                        const y = center + Math.sin(angle) * labelRadius;
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                            x: x,
                            y: y,
                            textAnchor: "middle",
                            dominantBaseline: "middle",
                            className: "fill-text-secondary",
                            fontSize: 9,
                            fontFamily: "Lexend",
                            children: __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FEATURE_LABELS"][f]
                        }, `label-${i}`, false, {
                            fileName: "[project]/components/SpiderChart.tsx",
                            lineNumber: 107,
                            columnNumber: 13
                        }, this);
                    })
                ]
            }, void 0, true, {
                fileName: "[project]/components/SpiderChart.tsx",
                lineNumber: 42,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex gap-4 mt-2",
                children: data.map((d, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-1.5 text-xs",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-3 h-3 rounded-sm",
                                style: {
                                    background: d.color
                                }
                            }, void 0, false, {
                                fileName: "[project]/components/SpiderChart.tsx",
                                lineNumber: 127,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-text-secondary truncate max-w-[120px]",
                                children: d.label
                            }, void 0, false, {
                                fileName: "[project]/components/SpiderChart.tsx",
                                lineNumber: 128,
                                columnNumber: 13
                            }, this)
                        ]
                    }, i, true, {
                        fileName: "[project]/components/SpiderChart.tsx",
                        lineNumber: 126,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/components/SpiderChart.tsx",
                lineNumber: 124,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/SpiderChart.tsx",
        lineNumber: 41,
        columnNumber: 5
    }, this);
}
_s(SpiderChart, "2p2PffbLIYmlYey1Np286Nvug5E=");
_c = SpiderChart;
var _c;
__turbopack_refresh__.register(_c, "SpiderChart");

})()),
"[project]/app/compare/page.tsx [app-client] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, k: __turbopack_refresh__ }) => (() => {
"use strict";

__turbopack_esm__({
    "default": ()=>ComparePage
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useRecommendations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/hooks/useRecommendations.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useRunnerProfile$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/hooks/useRunnerProfile.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useShoeDetails$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/hooks/useShoeDetails.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/types/index.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Panel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/components/Panel.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$SpiderChart$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/components/SpiderChart.tsx [app-client] (ecmascript)");
"__TURBOPACK__ecmascript__hoisting__location__";
;
var _s = __turbopack_refresh__.signature();
"use client";
;
;
;
;
;
;
;
;
const COMPARE_COLORS = [
    "#2563EB",
    "#16A34A",
    "#F59E0B"
];
function ComparePage() {
    _s();
    const { recommendations, loading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useRecommendations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRecommendations"])();
    const { preferenceVector } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useRunnerProfile$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRunnerProfile"])();
    const { details } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useShoeDetails$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useShoeDetails"])();
    const [selectedIds, setSelectedIds] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const compareShoes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (selectedIds.length >= 2) {
            return recommendations.filter((s)=>selectedIds.includes(s.id));
        }
        return recommendations.slice(0, 3);
    }, [
        recommendations,
        selectedIds
    ]);
    const toggleShoe = (id)=>{
        setSelectedIds((prev)=>{
            if (prev.includes(id)) return prev.filter((x)=>x !== id);
            if (prev.length >= 3) return [
                ...prev.slice(1),
                id
            ];
            return [
                ...prev,
                id
            ];
        });
    };
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen pt-20 flex items-center justify-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-text-secondary text-sm animate-pulse",
                children: "Loading..."
            }, void 0, false, {
                fileName: "[project]/app/compare/page.tsx",
                lineNumber: 38,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/compare/page.tsx",
            lineNumber: 37,
            columnNumber: 7
        }, this);
    }
    // Spider chart data: shoes + user preference overlay
    const spiderData = [
        ...compareShoes.map((shoe, i)=>({
                label: shoe.model.split(" ").slice(-2).join(" "),
                values: shoe.features,
                color: COMPARE_COLORS[i % COMPARE_COLORS.length]
            })),
        {
            label: "Your Preference",
            values: preferenceVector,
            color: "#7C3AED"
        }
    ];
    // Find biggest difference per feature
    const featureDeltas = __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FEATURE_KEYS"].map((f)=>{
        const vals = compareShoes.map((s)=>s.features[f]);
        return {
            feature: f,
            delta: Math.max(...vals) - Math.min(...vals)
        };
    }).sort((a, b)=>b.delta - a.delta);
    // Best-in-class per feature
    const bestInClass = (f)=>{
        let best = compareShoes[0];
        for (const s of compareShoes){
            if (s.features[f] > best.features[f]) best = s;
        }
        return best;
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen pt-20 px-6 pb-10",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-7xl mx-auto",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                initial: {
                    opacity: 0
                },
                animate: {
                    opacity: 1
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-lg text-text-primary mb-6 font-medium",
                        children: "Comparison Dashboard"
                    }, void 0, false, {
                        fileName: "[project]/app/compare/page.tsx",
                        lineNumber: 76,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-wrap gap-2 mb-6",
                        children: recommendations.slice(0, 12).map((shoe)=>{
                            const idx = compareShoes.findIndex((s)=>s.id === shoe.id);
                            const active = idx !== -1;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>toggleShoe(shoe.id),
                                className: `px-3 py-1.5 text-xs rounded border transition-all ${active ? "text-bg font-medium" : "border-border text-text-secondary hover:border-text-muted"}`,
                                style: active ? {
                                    borderColor: COMPARE_COLORS[idx % COMPARE_COLORS.length],
                                    background: COMPARE_COLORS[idx % COMPARE_COLORS.length]
                                } : undefined,
                                children: shoe.model
                            }, shoe.id, false, {
                                fileName: "[project]/app/compare/page.tsx",
                                lineNumber: 84,
                                columnNumber: 17
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/app/compare/page.tsx",
                        lineNumber: 79,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 lg:grid-cols-12 gap-5 mb-5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "lg:col-span-5 space-y-4",
                                children: compareShoes.map((shoe, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                        initial: {
                                            opacity: 0,
                                            y: 10
                                        },
                                        animate: {
                                            opacity: 1,
                                            y: 0
                                        },
                                        transition: {
                                            delay: i * 0.1
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "border border-border bg-bg-panel rounded-lg p-4 flex gap-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "w-1.5 rounded-full flex-shrink-0 self-stretch",
                                                    style: {
                                                        background: COMPARE_COLORS[i % COMPARE_COLORS.length]
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/app/compare/page.tsx",
                                                    lineNumber: 119,
                                                    columnNumber: 21
                                                }, this),
                                                shoe.image_url && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                    src: shoe.image_url,
                                                    alt: shoe.model,
                                                    className: "w-16 h-16 rounded-lg object-cover bg-bg flex-shrink-0",
                                                    onError: (e)=>{
                                                        e.target.style.display = "none";
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/app/compare/page.tsx",
                                                    lineNumber: 124,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex-1 min-w-0",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-start justify-between gap-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "text-sm font-medium text-text-primary truncate",
                                                                            children: shoe.model
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/compare/page.tsx",
                                                                            lineNumber: 136,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "text-xs text-text-secondary",
                                                                            children: shoe.brand
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/compare/page.tsx",
                                                                            lineNumber: 139,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/compare/page.tsx",
                                                                    lineNumber: 135,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "text-right flex-shrink-0",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "text-2xl font-bold leading-tight",
                                                                            style: {
                                                                                color: COMPARE_COLORS[i % COMPARE_COLORS.length]
                                                                            },
                                                                            children: (shoe.score * 100).toFixed(0)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/compare/page.tsx",
                                                                            lineNumber: 142,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "text-[10px] text-text-muted",
                                                                            children: "Match"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/compare/page.tsx",
                                                                            lineNumber: 148,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/compare/page.tsx",
                                                                    lineNumber: 141,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/compare/page.tsx",
                                                            lineNumber: 134,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex gap-2 mt-2 text-[11px] text-text-muted",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "capitalize",
                                                                    children: shoe.category.replace("_", " ")
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/compare/page.tsx",
                                                                    lineNumber: 152,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    children: "·"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/compare/page.tsx",
                                                                    lineNumber: 153,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "capitalize",
                                                                    children: shoe.tags.terrain
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/compare/page.tsx",
                                                                    lineNumber: 154,
                                                                    columnNumber: 25
                                                                }, this),
                                                                shoe.price && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            children: "·"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/compare/page.tsx",
                                                                            lineNumber: 157,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            children: [
                                                                                "$",
                                                                                shoe.price
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/app/compare/page.tsx",
                                                                            lineNumber: 158,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/compare/page.tsx",
                                                            lineNumber: 151,
                                                            columnNumber: 23
                                                        }, this),
                                                        (details[shoe.id]?.pros || shoe.pros)?.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-[11px] text-text-muted mt-2 leading-relaxed line-clamp-2",
                                                            children: (details[shoe.id]?.pros || shoe.pros)[0]
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/compare/page.tsx",
                                                            lineNumber: 163,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/compare/page.tsx",
                                                    lineNumber: 133,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/compare/page.tsx",
                                            lineNumber: 118,
                                            columnNumber: 19
                                        }, this)
                                    }, shoe.id, false, {
                                        fileName: "[project]/app/compare/page.tsx",
                                        lineNumber: 112,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/app/compare/page.tsx",
                                lineNumber: 110,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "lg:col-span-7",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Panel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    className: "flex flex-col items-center justify-center h-full",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$SpiderChart$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        data: spiderData,
                                        features: __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FEATURE_KEYS"],
                                        size: 380
                                    }, void 0, false, {
                                        fileName: "[project]/app/compare/page.tsx",
                                        lineNumber: 176,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/compare/page.tsx",
                                    lineNumber: 175,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/compare/page.tsx",
                                lineNumber: 174,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/compare/page.tsx",
                        lineNumber: 108,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 lg:grid-cols-12 gap-5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "lg:col-span-8",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-2 md:grid-cols-4 gap-3",
                                    children: __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FEATURE_KEYS"].map((f)=>{
                                        const best = bestInClass(f);
                                        const bestIdx = compareShoes.findIndex((s)=>s.id === best.id);
                                        const delta = featureDeltas.find((d)=>d.feature === f);
                                        const isHighDelta = delta.delta > 0.15;
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: `border rounded-lg p-3 bg-bg-panel transition-colors ${isHighDelta ? "border-border" : "border-border/50"}`,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-[10px] text-text-muted uppercase tracking-wider mb-2",
                                                    children: __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FEATURE_LABELS"][f]
                                                }, void 0, false, {
                                                    fileName: "[project]/app/compare/page.tsx",
                                                    lineNumber: 199,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "space-y-1.5",
                                                    children: compareShoes.map((shoe, i)=>{
                                                        const val = shoe.features[f];
                                                        const isBest = shoe.id === best.id && isHighDelta;
                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex-1 h-2 bg-bg rounded-full overflow-hidden",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                                                        initial: {
                                                                            width: 0
                                                                        },
                                                                        animate: {
                                                                            width: `${val * 100}%`
                                                                        },
                                                                        transition: {
                                                                            duration: 0.6,
                                                                            delay: 0.05 * i
                                                                        },
                                                                        className: "h-full rounded-full",
                                                                        style: {
                                                                            background: COMPARE_COLORS[i % COMPARE_COLORS.length],
                                                                            opacity: isBest ? 1 : 0.4
                                                                        }
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/compare/page.tsx",
                                                                        lineNumber: 209,
                                                                        columnNumber: 33
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/compare/page.tsx",
                                                                    lineNumber: 208,
                                                                    columnNumber: 31
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-[11px] w-7 text-right tabular-nums",
                                                                    style: {
                                                                        color: isBest ? COMPARE_COLORS[i % COMPARE_COLORS.length] : "#9CA3AF"
                                                                    },
                                                                    children: (val * 100).toFixed(0)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/compare/page.tsx",
                                                                    lineNumber: 220,
                                                                    columnNumber: 31
                                                                }, this)
                                                            ]
                                                        }, shoe.id, true, {
                                                            fileName: "[project]/app/compare/page.tsx",
                                                            lineNumber: 207,
                                                            columnNumber: 29
                                                        }, this);
                                                    })
                                                }, void 0, false, {
                                                    fileName: "[project]/app/compare/page.tsx",
                                                    lineNumber: 202,
                                                    columnNumber: 23
                                                }, this),
                                                isHighDelta && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "mt-2 text-[10px] text-text-muted",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            style: {
                                                                color: COMPARE_COLORS[bestIdx % COMPARE_COLORS.length]
                                                            },
                                                            children: best.model.split(" ").pop()
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/compare/page.tsx",
                                                            lineNumber: 236,
                                                            columnNumber: 27
                                                        }, this),
                                                        " ",
                                                        "leads by ",
                                                        (delta.delta * 100).toFixed(0),
                                                        "pts"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/compare/page.tsx",
                                                    lineNumber: 235,
                                                    columnNumber: 25
                                                }, this)
                                            ]
                                        }, f, true, {
                                            fileName: "[project]/app/compare/page.tsx",
                                            lineNumber: 193,
                                            columnNumber: 21
                                        }, this);
                                    })
                                }, void 0, false, {
                                    fileName: "[project]/app/compare/page.tsx",
                                    lineNumber: 185,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/compare/page.tsx",
                                lineNumber: 184,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "lg:col-span-4 space-y-4",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Panel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    title: "Biggest Differences",
                                    children: featureDeltas.slice(0, 4).map((d)=>{
                                        const best = bestInClass(d.feature);
                                        const bestIdx = compareShoes.findIndex((s)=>s.id === best.id);
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center justify-between py-2 border-b border-border/30 last:border-0",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-xs text-text-primary",
                                                            children: __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FEATURE_LABELS"][d.feature]
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/compare/page.tsx",
                                                            lineNumber: 259,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-[10px] text-text-muted",
                                                            children: [
                                                                "Gap: ",
                                                                (d.delta * 100).toFixed(0),
                                                                "pts"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/compare/page.tsx",
                                                            lineNumber: 260,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/compare/page.tsx",
                                                    lineNumber: 258,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-xs font-medium px-2 py-0.5 rounded",
                                                    style: {
                                                        color: COMPARE_COLORS[bestIdx % COMPARE_COLORS.length],
                                                        background: COMPARE_COLORS[bestIdx % COMPARE_COLORS.length] + "15"
                                                    },
                                                    children: best.model.split(" ").slice(-2).join(" ")
                                                }, void 0, false, {
                                                    fileName: "[project]/app/compare/page.tsx",
                                                    lineNumber: 264,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, d.feature, true, {
                                            fileName: "[project]/app/compare/page.tsx",
                                            lineNumber: 257,
                                            columnNumber: 21
                                        }, this);
                                    })
                                }, void 0, false, {
                                    fileName: "[project]/app/compare/page.tsx",
                                    lineNumber: 252,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/compare/page.tsx",
                                lineNumber: 251,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/compare/page.tsx",
                        lineNumber: 182,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/compare/page.tsx",
                lineNumber: 75,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/compare/page.tsx",
            lineNumber: 74,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/compare/page.tsx",
        lineNumber: 73,
        columnNumber: 5
    }, this);
}
_s(ComparePage, "sQPrFScvisFP29wghwqVnOivU5g=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useRecommendations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRecommendations"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useRunnerProfile$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRunnerProfile"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useShoeDetails$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useShoeDetails"]
    ];
});
_c = ComparePage;
var _c;
__turbopack_refresh__.register(_c, "ComparePage");

})()),
"[project]/app/compare/page.tsx [app-rsc] (ecmascript, Next.js server component, client modules)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname }) => (() => {


})()),
}]);

//# sourceMappingURL=_365791._.js.map