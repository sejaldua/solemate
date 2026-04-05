(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["static/chunks/_947aa2._.js", {

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
"[project]/app/explore/page.tsx [app-client] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, k: __turbopack_refresh__ }) => (() => {
"use strict";

__turbopack_esm__({
    "default": ()=>ExplorePage
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/shared/lib/app-dynamic.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useShoeData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/hooks/useShoeData.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useRunnerProfile$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/hooks/useRunnerProfile.ts [app-client] (ecmascript)");
"__TURBOPACK__ecmascript__hoisting__location__";
;
var _s = __turbopack_refresh__.signature();
"use client";
;
;
;
;
;
const ShoeMap = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_require__("[project]/components/ShoeMap.tsx [app-client] (ecmascript, async loader)")(__turbopack_import__), {
    loadableGenerated: {
        modules: [
            "app/explore/page.tsx -> " + "@/components/ShoeMap"
        ]
    },
    ssr: false,
    loading: ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-center h-full text-text-muted text-sm animate-pulse",
            children: "Loading map..."
        }, void 0, false, {
            fileName: "[project]/app/explore/page.tsx",
            lineNumber: 11,
            columnNumber: 18
        }, this)
});
_c = ShoeMap;
function ExplorePage() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { shoes, embeddings, clusters, meta, loading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useShoeData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useShoeData"])();
    const { preferenceVector } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useRunnerProfile$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRunnerProfile"])();
    if (loading || !embeddings || !clusters || !meta) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen pt-20 flex items-center justify-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-text-secondary text-sm animate-pulse",
                children: "Loading shoe space..."
            }, void 0, false, {
                fileName: "[project]/app/explore/page.tsx",
                lineNumber: 22,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/explore/page.tsx",
            lineNumber: 21,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen pt-20 px-6 pb-10 flex flex-col",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-7xl mx-auto w-full flex-1 flex flex-col",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                    initial: {
                        opacity: 0
                    },
                    animate: {
                        opacity: 1
                    },
                    className: "flex items-center justify-between mb-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "text-lg text-text-primary font-medium",
                            children: "Shoe Space"
                        }, void 0, false, {
                            fileName: "[project]/app/explore/page.tsx",
                            lineNumber: 35,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-xs text-text-muted",
                                    children: "Scroll to zoom · drag to pan"
                                }, void 0, false, {
                                    fileName: "[project]/app/explore/page.tsx",
                                    lineNumber: 37,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>router.push("/recommendations"),
                                    className: "bg-neon-blue text-white px-4 py-1.5 text-xs font-medium hover:opacity-90 transition-colors rounded-lg",
                                    children: "View Recommendations"
                                }, void 0, false, {
                                    fileName: "[project]/app/explore/page.tsx",
                                    lineNumber: 40,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/explore/page.tsx",
                            lineNumber: 36,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/explore/page.tsx",
                    lineNumber: 30,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                    initial: {
                        opacity: 0,
                        scale: 0.98
                    },
                    animate: {
                        opacity: 1,
                        scale: 1
                    },
                    transition: {
                        delay: 0.15
                    },
                    className: "flex-1 border border-border rounded-lg bg-bg-panel overflow-hidden",
                    style: {
                        minHeight: 500
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ShoeMap, {
                        shoes: shoes,
                        embeddings: embeddings,
                        clusters: clusters,
                        meta: meta,
                        preferenceVector: preferenceVector,
                        onShoeClick: (shoe)=>{
                            router.push(`/recommendations?highlight=${shoe.id}`);
                        }
                    }, void 0, false, {
                        fileName: "[project]/app/explore/page.tsx",
                        lineNumber: 57,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/explore/page.tsx",
                    lineNumber: 50,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/explore/page.tsx",
            lineNumber: 29,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/explore/page.tsx",
        lineNumber: 28,
        columnNumber: 5
    }, this);
}
_s(ExplorePage, "T4sRHkHoTAyZN9tKDnDDMUA8dKg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useShoeData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useShoeData"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useRunnerProfile$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRunnerProfile"]
    ];
});
_c1 = ExplorePage;
var _c, _c1;
__turbopack_refresh__.register(_c, "ShoeMap");
__turbopack_refresh__.register(_c1, "ExplorePage");

})()),
"[project]/app/explore/page.tsx [app-rsc] (ecmascript, Next.js server component, client modules)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname }) => (() => {


})()),
}]);

//# sourceMappingURL=_947aa2._.js.map