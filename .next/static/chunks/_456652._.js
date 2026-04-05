(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["static/chunks/_456652._.js", {

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
"[project]/utils/rotation.ts [app-client] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, k: __turbopack_refresh__ }) => (() => {
"use strict";

__turbopack_esm__({
    "ROLE_LABELS": ()=>ROLE_LABELS,
    "classifyRole": ()=>classifyRole,
    "optimizeRotation": ()=>optimizeRotation
});
var __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/types/index.ts [app-client] (ecmascript)");
"__TURBOPACK__ecmascript__hoisting__location__";
;
const ROLE_LABELS = {
    daily_trainer: "Daily Trainer",
    long_run: "Long Run",
    speed_work: "Speed Work",
    recovery: "Recovery",
    trail: "Trail"
};
function euclideanDistance(a, b) {
    let sum = 0;
    for (const k of __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FEATURE_KEYS"]){
        sum += (a[k] - b[k]) ** 2;
    }
    return Math.sqrt(sum);
}
function classifyRole(shoe) {
    const f = shoe.features;
    if (shoe.tags.terrain === "trail") {
        return {
            primary: "trail",
            label: ROLE_LABELS.trail
        };
    }
    // Speed work: light + flexible + high energy return
    if (f.weight > 0.7 && f.flexibility > 0.6 && f.energy_return > 0.6) {
        return {
            primary: "speed_work",
            label: ROLE_LABELS.speed_work
        };
    }
    // Recovery: very soft + high stack
    if (f.midsole_softness > 0.7 && f.stack_height > 0.7) {
        return {
            primary: "recovery",
            label: ROLE_LABELS.recovery
        };
    }
    // Long run: good cushion + durability (approximated by moderate weight)
    if (f.stack_height > 0.55 && f.midsole_softness > 0.5 && f.weight < 0.6) {
        return {
            primary: "long_run",
            label: ROLE_LABELS.long_run
        };
    }
    return {
        primary: "daily_trainer",
        label: ROLE_LABELS.daily_trainer
    };
}
function optimizeRotation(candidates, slots = 3) {
    const selected = [];
    const coveredRoles = new Set();
    const allRoles = [
        "daily_trainer",
        "long_run",
        "speed_work",
        "recovery",
        "trail"
    ];
    for(let i = 0; i < slots; i++){
        let bestCandidate = null;
        let bestValue = -Infinity;
        for (const shoe of candidates){
            if (selected.some((s)=>s.id === shoe.id)) continue;
            const role = classifyRole(shoe);
            const novelty = coveredRoles.has(role.primary) ? 0 : 1;
            const diversity = selected.length === 0 ? 1 : selected.reduce((sum, s)=>sum + euclideanDistance(s.features, shoe.features), 0) / selected.length;
            const quality = shoe.score;
            const value = novelty * 2.0 + diversity * 1.0 + quality * 0.5;
            if (value > bestValue) {
                bestValue = value;
                bestCandidate = shoe;
            }
        }
        if (bestCandidate) {
            selected.push(bestCandidate);
            coveredRoles.add(classifyRole(bestCandidate).primary);
        }
    }
    // Compute coverage: fraction of useful roles covered
    const coverage = coveredRoles.size / Math.min(slots + 1, allRoles.length);
    // Compute redundancy: average pairwise similarity (lower = less redundant)
    let redundancy = 0;
    let pairs = 0;
    for(let i = 0; i < selected.length; i++){
        for(let j = i + 1; j < selected.length; j++){
            redundancy += 1 - euclideanDistance(selected[i].features, selected[j].features);
            pairs++;
        }
    }
    redundancy = pairs > 0 ? redundancy / pairs : 0;
    return {
        shoes: selected,
        coverage,
        redundancy
    };
}
;

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
"[project]/components/ConfidenceBar.tsx [app-client] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, k: __turbopack_refresh__ }) => (() => {
"use strict";

__turbopack_esm__({
    "default": ()=>ConfidenceBar
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
"__TURBOPACK__ecmascript__hoisting__location__";
;
function ConfidenceBar({ value, label, color = "bg-neon-green", maxValue = 1 }) {
    const pct = Math.round(value / maxValue * 100);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-1",
        children: [
            label && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-between text-xs",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-text-secondary",
                        children: label
                    }, void 0, false, {
                        fileName: "[project]/components/ConfidenceBar.tsx",
                        lineNumber: 18,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-text-primary",
                        children: [
                            pct,
                            "%"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ConfidenceBar.tsx",
                        lineNumber: 19,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ConfidenceBar.tsx",
                lineNumber: 17,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "h-1.5 bg-bg rounded-full overflow-hidden",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `h-full ${color} rounded-full transition-all duration-500`,
                    style: {
                        width: `${pct}%`
                    }
                }, void 0, false, {
                    fileName: "[project]/components/ConfidenceBar.tsx",
                    lineNumber: 23,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/ConfidenceBar.tsx",
                lineNumber: 22,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ConfidenceBar.tsx",
        lineNumber: 15,
        columnNumber: 5
    }, this);
}
_c = ConfidenceBar;
var _c;
__turbopack_refresh__.register(_c, "ConfidenceBar");

})()),
"[project]/app/rotation/page.tsx [app-client] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, k: __turbopack_refresh__ }) => (() => {
"use strict";

__turbopack_esm__({
    "default": ()=>RotationPage
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useRecommendations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/hooks/useRecommendations.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$rotation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/utils/rotation.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/types/index.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Panel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/components/Panel.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ConfidenceBar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/components/ConfidenceBar.tsx [app-client] (ecmascript)");
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
function RotationSlot({ shoe, role, slotLabel, onSwap }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Panel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        className: "relative",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute top-3 right-3 text-xs text-neon-blue bg-neon-blue/10 px-2 py-1 rounded",
                children: slotLabel
            }, void 0, false, {
                fileName: "[project]/app/rotation/page.tsx",
                lineNumber: 25,
                columnNumber: 7
            }, this),
            shoe.image_url && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-center mb-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                    src: shoe.image_url,
                    alt: shoe.model,
                    className: "w-28 h-28 rounded-xl object-cover bg-bg",
                    onError: (e)=>{
                        e.target.style.display = "none";
                    }
                }, void 0, false, {
                    fileName: "[project]/app/rotation/page.tsx",
                    lineNumber: 30,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/rotation/page.tsx",
                lineNumber: 29,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-xs text-text-muted mb-1",
                children: role.label
            }, void 0, false, {
                fileName: "[project]/app/rotation/page.tsx",
                lineNumber: 38,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: "text-lg text-text-primary font-medium",
                children: shoe.model
            }, void 0, false, {
                fileName: "[project]/app/rotation/page.tsx",
                lineNumber: 39,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-sm text-text-secondary mb-3",
                children: shoe.brand
            }, void 0, false, {
                fileName: "[project]/app/rotation/page.tsx",
                lineNumber: 40,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-3 mb-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-2xl text-neon-green font-bold",
                        children: (shoe.score * 100).toFixed(0)
                    }, void 0, false, {
                        fileName: "[project]/app/rotation/page.tsx",
                        lineNumber: 43,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-xs text-text-muted",
                        children: "Match"
                    }, void 0, false, {
                        fileName: "[project]/app/rotation/page.tsx",
                        lineNumber: 46,
                        columnNumber: 9
                    }, this),
                    shoe.price && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "ml-auto text-sm text-text-secondary",
                        children: [
                            "$",
                            shoe.price
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/rotation/page.tsx",
                        lineNumber: 48,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/rotation/page.tsx",
                lineNumber: 42,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-2",
                children: __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FEATURE_KEYS"].slice(0, 5).map((f)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2 text-xs",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "w-24 text-text-muted",
                                children: __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FEATURE_LABELS"][f]
                            }, void 0, false, {
                                fileName: "[project]/app/rotation/page.tsx",
                                lineNumber: 55,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-1 h-1 bg-bg rounded-full overflow-hidden",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "h-full bg-neon-blue rounded-full",
                                    style: {
                                        width: `${shoe.features[f] * 100}%`
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/app/rotation/page.tsx",
                                    lineNumber: 57,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/rotation/page.tsx",
                                lineNumber: 56,
                                columnNumber: 13
                            }, this)
                        ]
                    }, f, true, {
                        fileName: "[project]/app/rotation/page.tsx",
                        lineNumber: 54,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/app/rotation/page.tsx",
                lineNumber: 52,
                columnNumber: 7
            }, this),
            onSwap && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: onSwap,
                className: "mt-3 text-xs text-text-muted hover:text-text-primary transition-colors",
                children: "Swap"
            }, void 0, false, {
                fileName: "[project]/app/rotation/page.tsx",
                lineNumber: 67,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/rotation/page.tsx",
        lineNumber: 24,
        columnNumber: 5
    }, this);
}
_c = RotationSlot;
function RotationPage() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { recommendations, loading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useRecommendations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRecommendations"])();
    const [slots, setSlots] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(3);
    const rotation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (recommendations.length === 0) return null;
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$rotation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["optimizeRotation"])(recommendations.slice(0, 15), slots);
    }, [
        recommendations,
        slots
    ]);
    if (loading || !rotation) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen pt-20 flex items-center justify-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-text-secondary text-sm animate-pulse",
                children: "Optimizing rotation..."
            }, void 0, false, {
                fileName: "[project]/app/rotation/page.tsx",
                lineNumber: 91,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/rotation/page.tsx",
            lineNumber: 90,
            columnNumber: 7
        }, this);
    }
    const slotLabels = [
        "Daily",
        "Speed",
        "Long Run",
        "Recovery",
        "Trail"
    ];
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between mb-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-lg text-text-primary font-medium",
                                children: "Rotation Builder"
                            }, void 0, false, {
                                fileName: "[project]/app/rotation/page.tsx",
                                lineNumber: 103,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2 text-xs",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-text-secondary",
                                                children: "Shoes:"
                                            }, void 0, false, {
                                                fileName: "[project]/app/rotation/page.tsx",
                                                lineNumber: 106,
                                                columnNumber: 17
                                            }, this),
                                            [
                                                2,
                                                3
                                            ].map((n)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>setSlots(n),
                                                    className: `px-2 py-1 rounded border text-xs ${slots === n ? "border-neon-green text-neon-green" : "border-border text-text-muted hover:text-text-secondary"}`,
                                                    children: n
                                                }, n, false, {
                                                    fileName: "[project]/app/rotation/page.tsx",
                                                    lineNumber: 108,
                                                    columnNumber: 19
                                                }, this))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/rotation/page.tsx",
                                        lineNumber: 105,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>router.push("/compare"),
                                        className: "bg-neon-green text-white px-4 py-1.5 text-xs font-medium hover:opacity-90 transition-colors rounded-lg",
                                        children: "Compare"
                                    }, void 0, false, {
                                        fileName: "[project]/app/rotation/page.tsx",
                                        lineNumber: 121,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/rotation/page.tsx",
                                lineNumber: 104,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/rotation/page.tsx",
                        lineNumber: 102,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-2 gap-4 mb-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Panel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-xs text-text-muted mb-1",
                                        children: "Coverage Score"
                                    }, void 0, false, {
                                        fileName: "[project]/app/rotation/page.tsx",
                                        lineNumber: 134,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-2xl text-neon-green font-bold mb-2",
                                        children: [
                                            (rotation.coverage * 100).toFixed(0),
                                            "%"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/rotation/page.tsx",
                                        lineNumber: 135,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ConfidenceBar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        value: rotation.coverage,
                                        label: "Role coverage"
                                    }, void 0, false, {
                                        fileName: "[project]/app/rotation/page.tsx",
                                        lineNumber: 138,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/rotation/page.tsx",
                                lineNumber: 133,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Panel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-xs text-text-muted mb-1",
                                        children: "Redundancy"
                                    }, void 0, false, {
                                        fileName: "[project]/app/rotation/page.tsx",
                                        lineNumber: 141,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-2xl text-neon-orange font-bold mb-2",
                                        children: [
                                            (rotation.redundancy * 100).toFixed(0),
                                            "%"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/rotation/page.tsx",
                                        lineNumber: 142,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ConfidenceBar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        value: rotation.redundancy,
                                        label: "Overlap penalty",
                                        color: "bg-neon-orange"
                                    }, void 0, false, {
                                        fileName: "[project]/app/rotation/page.tsx",
                                        lineNumber: 145,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-text-muted mt-2",
                                        children: "Lower is better"
                                    }, void 0, false, {
                                        fileName: "[project]/app/rotation/page.tsx",
                                        lineNumber: 150,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/rotation/page.tsx",
                                lineNumber: 140,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/rotation/page.tsx",
                        lineNumber: 132,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `grid gap-6 ${slots === 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:grid-cols-3"}`,
                        children: rotation.shoes.map((shoe, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                initial: {
                                    opacity: 0,
                                    y: 20
                                },
                                animate: {
                                    opacity: 1,
                                    y: 0
                                },
                                transition: {
                                    delay: i * 0.15
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(RotationSlot, {
                                    shoe: shoe,
                                    role: (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$rotation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["classifyRole"])(shoe),
                                    slotLabel: slotLabels[i] || `SLOT ${i + 1}`
                                }, void 0, false, {
                                    fileName: "[project]/app/rotation/page.tsx",
                                    lineNumber: 163,
                                    columnNumber: 17
                                }, this)
                            }, shoe.id, false, {
                                fileName: "[project]/app/rotation/page.tsx",
                                lineNumber: 157,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/app/rotation/page.tsx",
                        lineNumber: 155,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/rotation/page.tsx",
                lineNumber: 101,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/rotation/page.tsx",
            lineNumber: 100,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/rotation/page.tsx",
        lineNumber: 99,
        columnNumber: 5
    }, this);
}
_s(RotationPage, "Z2oktvG5D1Q3iyCPQBo1huOSiws=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useRecommendations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRecommendations"]
    ];
});
_c1 = RotationPage;
var _c, _c1;
__turbopack_refresh__.register(_c, "RotationSlot");
__turbopack_refresh__.register(_c1, "RotationPage");

})()),
"[project]/app/rotation/page.tsx [app-rsc] (ecmascript, Next.js server component, client modules)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname }) => (() => {


})()),
}]);

//# sourceMappingURL=_456652._.js.map