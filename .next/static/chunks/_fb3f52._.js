(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["static/chunks/_fb3f52._.js", {

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
"[project]/components/WarningFlag.tsx [app-client] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, k: __turbopack_refresh__ }) => (() => {
"use strict";

__turbopack_esm__({
    "default": ()=>WarningFlag
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
"__TURBOPACK__ecmascript__hoisting__location__";
;
function WarningFlag({ message }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-center gap-2 text-xs bg-neon-orange/10 border border-neon-orange/30 text-neon-orange rounded px-3 py-2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-base",
                children: "!"
            }, void 0, false, {
                fileName: "[project]/components/WarningFlag.tsx",
                lineNumber: 4,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                children: message
            }, void 0, false, {
                fileName: "[project]/components/WarningFlag.tsx",
                lineNumber: 5,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/WarningFlag.tsx",
        lineNumber: 3,
        columnNumber: 5
    }, this);
}
_c = WarningFlag;
var _c;
__turbopack_refresh__.register(_c, "WarningFlag");

})()),
"[project]/components/ShoeSelector.tsx [app-client] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, k: __turbopack_refresh__ }) => (() => {
"use strict";

__turbopack_esm__({
    "default": ()=>ShoeSelector
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
"__TURBOPACK__ecmascript__hoisting__location__";
;
var _s = __turbopack_refresh__.signature();
"use client";
;
function ShoeSelector({ shoes, selectedShoe, onSelect, placeholder = "Search for a shoe..." }) {
    _s();
    const [query, setQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [isOpen, setIsOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const ref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const filtered = query.length >= 2 ? shoes.filter((s)=>(s.model || "").toLowerCase().includes(query.toLowerCase()) || (s.brand || "").toLowerCase().includes(query.toLowerCase())).slice(0, 8) : [];
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        function handleClickOutside(e) {
            if (ref.current && !ref.current.contains(e.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return ()=>document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: "relative",
        children: [
            selectedShoe ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between border border-neon-green/40 bg-neon-green/5 rounded px-3 py-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-sm text-text-primary",
                                children: selectedShoe.model
                            }, void 0, false, {
                                fileName: "[project]/components/ShoeSelector.tsx",
                                lineNumber: 47,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs text-text-muted ml-2",
                                children: selectedShoe.brand
                            }, void 0, false, {
                                fileName: "[project]/components/ShoeSelector.tsx",
                                lineNumber: 48,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ShoeSelector.tsx",
                        lineNumber: 46,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>{
                            onSelect(null);
                            setQuery("");
                        },
                        className: "text-xs text-text-muted hover:text-neon-red transition-colors ml-2",
                        children: "Clear"
                    }, void 0, false, {
                        fileName: "[project]/components/ShoeSelector.tsx",
                        lineNumber: 50,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ShoeSelector.tsx",
                lineNumber: 45,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                type: "text",
                value: query,
                onChange: (e)=>{
                    setQuery(e.target.value);
                    setIsOpen(true);
                },
                onFocus: ()=>setIsOpen(true),
                placeholder: placeholder,
                className: "w-full bg-bg border border-border rounded px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-neon-green/50 focus:outline-none transition-colors"
            }, void 0, false, {
                fileName: "[project]/components/ShoeSelector.tsx",
                lineNumber: 61,
                columnNumber: 9
            }, this),
            isOpen && filtered.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute z-50 top-full left-0 right-0 mt-1 bg-bg-panel border border-border rounded-lg overflow-hidden shadow-xl max-h-64 overflow-y-auto",
                children: filtered.map((shoe)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>{
                            onSelect(shoe);
                            setIsOpen(false);
                            setQuery("");
                        },
                        className: "w-full text-left px-3 py-2 hover:bg-bg-hover transition-colors flex items-center gap-3",
                        children: [
                            shoe.image_url && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                src: shoe.image_url,
                                alt: shoe.model,
                                className: "w-8 h-8 rounded object-cover bg-bg",
                                onError: (e)=>{
                                    e.target.style.display = "none";
                                }
                            }, void 0, false, {
                                fileName: "[project]/components/ShoeSelector.tsx",
                                lineNumber: 89,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-sm text-text-primary",
                                        children: shoe.model
                                    }, void 0, false, {
                                        fileName: "[project]/components/ShoeSelector.tsx",
                                        lineNumber: 97,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-xs text-text-muted",
                                        children: [
                                            shoe.brand,
                                            " · ",
                                            shoe.category
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/ShoeSelector.tsx",
                                        lineNumber: 98,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/ShoeSelector.tsx",
                                lineNumber: 96,
                                columnNumber: 15
                            }, this)
                        ]
                    }, shoe.id, true, {
                        fileName: "[project]/components/ShoeSelector.tsx",
                        lineNumber: 79,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/components/ShoeSelector.tsx",
                lineNumber: 77,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ShoeSelector.tsx",
        lineNumber: 43,
        columnNumber: 5
    }, this);
}
_s(ShoeSelector, "zqRIr0vj9rs138z/8mF0IILZQC4=");
_c = ShoeSelector;
var _c;
__turbopack_refresh__.register(_c, "ShoeSelector");

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
"[project]/app/input/page.tsx [app-client] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, k: __turbopack_refresh__ }) => (() => {
"use strict";

__turbopack_esm__({
    "default": ()=>InputPage
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useRunnerProfile$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/hooks/useRunnerProfile.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useShoeData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/hooks/useShoeData.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Panel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/components/Panel.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$WarningFlag$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/components/WarningFlag.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ShoeSelector$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/components/ShoeSelector.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/types/index.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/utils/constants.ts [app-client] (ecmascript)");
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
;
const FEEDBACK_OPTIONS = [
    {
        value: "too_heavy",
        label: "Too heavy"
    },
    {
        value: "too_stiff",
        label: "Too stiff"
    },
    {
        value: "not_enough_cushion",
        label: "Not enough cushion"
    },
    {
        value: "too_soft",
        label: "Too soft/mushy"
    },
    {
        value: "too_narrow",
        label: "Too narrow"
    },
    {
        value: "poor_traction",
        label: "Poor traction"
    },
    {
        value: "wore_out_fast",
        label: "Wore out fast"
    },
    {
        value: "love_it",
        label: "Love it"
    }
];
function InputPage() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { shoes } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useShoeData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useShoeData"])();
    const { profile, archetype, insights, preferenceVector, currentShoe, currentShoeFeedback, setProfile, setCurrentShoe, setCurrentShoeFeedback } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useRunnerProfile$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRunnerProfile"])();
    const formatPace = (val)=>{
        const min = Math.floor(val);
        const sec = Math.round((val - min) * 60);
        return `${min}:${sec.toString().padStart(2, "0")}`;
    };
    const toggleInjury = (injury)=>{
        if (injury === "none") {
            setProfile({
                injuries: []
            });
            return;
        }
        const current = profile.injuries.filter((i)=>i !== "none");
        if (current.includes(injury)) {
            setProfile({
                injuries: current.filter((i)=>i !== injury)
            });
        } else {
            setProfile({
                injuries: [
                    ...current,
                    injury
                ]
            });
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen pt-20 px-6 pb-10",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-6xl mx-auto",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].h1, {
                    initial: {
                        opacity: 0,
                        y: -10
                    },
                    animate: {
                        opacity: 1,
                        y: 0
                    },
                    className: "text-lg text-text-primary mb-6 font-medium",
                    children: "Runner Profile"
                }, void 0, false, {
                    fileName: "[project]/app/input/page.tsx",
                    lineNumber: 61,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-1 lg:grid-cols-2 gap-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                            initial: {
                                opacity: 0,
                                x: -20
                            },
                            animate: {
                                opacity: 1,
                                x: 0
                            },
                            transition: {
                                delay: 0.1
                            },
                            className: "space-y-5",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Panel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    title: "Current Shoe",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ShoeSelector$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            shoes: shoes,
                                            selectedShoe: currentShoe,
                                            onSelect: setCurrentShoe,
                                            placeholder: "What are you running in now?"
                                        }, void 0, false, {
                                            fileName: "[project]/app/input/page.tsx",
                                            lineNumber: 78,
                                            columnNumber: 15
                                        }, this),
                                        currentShoe && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-xs text-text-muted mb-2",
                                                    children: "How do you feel about it?"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/input/page.tsx",
                                                    lineNumber: 86,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex flex-wrap gap-2",
                                                    children: FEEDBACK_OPTIONS.map((opt)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>setCurrentShoeFeedback(currentShoeFeedback === opt.value ? "" : opt.value),
                                                            className: `px-2.5 py-1 text-xs rounded border transition-colors ${currentShoeFeedback === opt.value ? opt.value === "love_it" ? "border-neon-green text-neon-green bg-neon-green/10" : "border-neon-blue text-neon-blue bg-neon-blue/10" : "border-border text-text-muted hover:border-text-secondary"}`,
                                                            children: opt.label
                                                        }, opt.value, false, {
                                                            fileName: "[project]/app/input/page.tsx",
                                                            lineNumber: 89,
                                                            columnNumber: 23
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/app/input/page.tsx",
                                                    lineNumber: 87,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/input/page.tsx",
                                            lineNumber: 85,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/input/page.tsx",
                                    lineNumber: 77,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Panel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    title: "Weekly Mileage",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center justify-between mb-2",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-2xl text-text-primary",
                                                children: [
                                                    profile.weeklyMileage,
                                                    " mi"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/input/page.tsx",
                                                lineNumber: 114,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/input/page.tsx",
                                            lineNumber: 113,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "range",
                                            min: 5,
                                            max: 100,
                                            value: profile.weeklyMileage,
                                            onChange: (e)=>setProfile({
                                                    weeklyMileage: Number(e.target.value)
                                                }),
                                            className: "w-full"
                                        }, void 0, false, {
                                            fileName: "[project]/app/input/page.tsx",
                                            lineNumber: 116,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex justify-between text-xs text-text-muted mt-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "5 mi"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/input/page.tsx",
                                                    lineNumber: 125,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "100 mi"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/input/page.tsx",
                                                    lineNumber: 126,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/input/page.tsx",
                                            lineNumber: 124,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/input/page.tsx",
                                    lineNumber: 112,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Panel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    title: "Typical Pace",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center justify-between mb-2",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-2xl text-text-primary",
                                                children: [
                                                    formatPace(profile.pace),
                                                    " /mi"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/input/page.tsx",
                                                lineNumber: 132,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/input/page.tsx",
                                            lineNumber: 131,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "range",
                                            min: 5,
                                            max: 13,
                                            step: 0.25,
                                            value: profile.pace,
                                            onChange: (e)=>setProfile({
                                                    pace: Number(e.target.value)
                                                }),
                                            className: "w-full"
                                        }, void 0, false, {
                                            fileName: "[project]/app/input/page.tsx",
                                            lineNumber: 134,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex justify-between text-xs text-text-muted mt-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "5:00"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/input/page.tsx",
                                                    lineNumber: 144,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "13:00"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/input/page.tsx",
                                                    lineNumber: 145,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/input/page.tsx",
                                            lineNumber: 143,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/input/page.tsx",
                                    lineNumber: 130,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Panel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    title: "Primary Terrain",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex gap-3",
                                        children: [
                                            "road",
                                            "trail",
                                            "mixed"
                                        ].map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setProfile({
                                                        terrain: t
                                                    }),
                                                className: `flex-1 py-2 px-3 text-sm rounded border transition-colors ${profile.terrain === t ? "border-neon-blue text-neon-blue bg-neon-blue/10" : "border-border text-text-secondary hover:border-text-muted"}`,
                                                children: t.charAt(0).toUpperCase() + t.slice(1)
                                            }, t, false, {
                                                fileName: "[project]/app/input/page.tsx",
                                                lineNumber: 152,
                                                columnNumber: 19
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/app/input/page.tsx",
                                        lineNumber: 150,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/input/page.tsx",
                                    lineNumber: 149,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Panel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    title: "Injury History",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex flex-wrap gap-2",
                                        children: __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["INJURY_OPTIONS"].map((opt)=>{
                                            const active = opt.value === "none" ? profile.injuries.length === 0 : profile.injuries.includes(opt.value);
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>toggleInjury(opt.value),
                                                className: `px-3 py-1.5 text-xs rounded border transition-colors ${active ? opt.value === "none" ? "border-neon-green text-neon-green bg-neon-green/10" : "border-neon-orange text-neon-orange bg-neon-orange/10" : "border-border text-text-secondary hover:border-text-muted"}`,
                                                children: opt.label
                                            }, opt.value, false, {
                                                fileName: "[project]/app/input/page.tsx",
                                                lineNumber: 175,
                                                columnNumber: 21
                                            }, this);
                                        })
                                    }, void 0, false, {
                                        fileName: "[project]/app/input/page.tsx",
                                        lineNumber: 168,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/input/page.tsx",
                                    lineNumber: 167,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Panel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    title: "Comfort ↔ Speed",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-xs text-neon-blue",
                                                children: "Comfort"
                                            }, void 0, false, {
                                                fileName: "[project]/app/input/page.tsx",
                                                lineNumber: 195,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "range",
                                                min: 0,
                                                max: 100,
                                                value: profile.comfortSpeed,
                                                onChange: (e)=>setProfile({
                                                        comfortSpeed: Number(e.target.value)
                                                    }),
                                                className: "flex-1"
                                            }, void 0, false, {
                                                fileName: "[project]/app/input/page.tsx",
                                                lineNumber: 196,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-xs text-neon-orange",
                                                children: "Speed"
                                            }, void 0, false, {
                                                fileName: "[project]/app/input/page.tsx",
                                                lineNumber: 204,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/input/page.tsx",
                                        lineNumber: 194,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/input/page.tsx",
                                    lineNumber: 193,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/input/page.tsx",
                            lineNumber: 71,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                            initial: {
                                opacity: 0,
                                x: 20
                            },
                            animate: {
                                opacity: 1,
                                x: 0
                            },
                            transition: {
                                delay: 0.2
                            },
                            className: "space-y-5",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Panel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    title: "Runner Archetype",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-xl text-neon-blue mb-2 font-medium",
                                            children: __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ARCHETYPE_LABELS"][archetype]
                                        }, void 0, false, {
                                            fileName: "[project]/app/input/page.tsx",
                                            lineNumber: 217,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-text-secondary",
                                            children: __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ARCHETYPE_DESCRIPTIONS"][archetype]
                                        }, void 0, false, {
                                            fileName: "[project]/app/input/page.tsx",
                                            lineNumber: 220,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/input/page.tsx",
                                    lineNumber: 216,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Panel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    title: "Computed Insights",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-3",
                                        children: insights.map((insight, i)=>insight.warning ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$WarningFlag$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                message: `${insight.label}: ${insight.value}`
                                            }, i, false, {
                                                fileName: "[project]/app/input/page.tsx",
                                                lineNumber: 229,
                                                columnNumber: 21
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex justify-between items-center text-sm",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-text-secondary",
                                                        children: insight.label
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/input/page.tsx",
                                                        lineNumber: 232,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-text-primary font-medium",
                                                        children: insight.value
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/input/page.tsx",
                                                        lineNumber: 233,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, i, true, {
                                                fileName: "[project]/app/input/page.tsx",
                                                lineNumber: 231,
                                                columnNumber: 21
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/app/input/page.tsx",
                                        lineNumber: 226,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/input/page.tsx",
                                    lineNumber: 225,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Panel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    title: "Preference Vector",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-2",
                                        children: Object.keys(preferenceVector).map((key)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-3 text-xs",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "w-28 text-text-secondary",
                                                        children: __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FEATURE_LABELS"][key]
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/input/page.tsx",
                                                        lineNumber: 244,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex-1 h-1.5 bg-bg rounded-full overflow-hidden",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "h-full bg-neon-blue rounded-full transition-all duration-300",
                                                            style: {
                                                                width: `${preferenceVector[key] * 100}%`
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/input/page.tsx",
                                                            lineNumber: 246,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/input/page.tsx",
                                                        lineNumber: 245,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "w-10 text-right text-text-muted",
                                                        children: (preferenceVector[key] * 100).toFixed(0)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/input/page.tsx",
                                                        lineNumber: 251,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, key, true, {
                                                fileName: "[project]/app/input/page.tsx",
                                                lineNumber: 243,
                                                columnNumber: 19
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/app/input/page.tsx",
                                        lineNumber: 241,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/input/page.tsx",
                                    lineNumber: 240,
                                    columnNumber: 13
                                }, this),
                                currentShoe && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Panel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    title: "Current Shoe Profile",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-2",
                                        children: [
                                            Object.keys(currentShoe.features).map((key)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-3 text-xs",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "w-28 text-text-secondary",
                                                            children: __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FEATURE_LABELS"][key]
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/input/page.tsx",
                                                            lineNumber: 264,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex-1 h-1.5 bg-bg rounded-full overflow-hidden relative",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "h-full bg-text-muted rounded-full absolute",
                                                                    style: {
                                                                        width: `${currentShoe.features[key] * 100}%`
                                                                    }
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/input/page.tsx",
                                                                    lineNumber: 266,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "h-full bg-neon-blue rounded-full absolute opacity-60",
                                                                    style: {
                                                                        width: `${preferenceVector[key] * 100}%`
                                                                    }
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/input/page.tsx",
                                                                    lineNumber: 270,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/input/page.tsx",
                                                            lineNumber: 265,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, key, true, {
                                                    fileName: "[project]/app/input/page.tsx",
                                                    lineNumber: 263,
                                                    columnNumber: 21
                                                }, this)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex gap-4 mt-2 text-[10px] text-text-muted",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "flex items-center gap-1",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "w-2 h-2 rounded-full bg-text-muted inline-block"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/input/page.tsx",
                                                                lineNumber: 279,
                                                                columnNumber: 23
                                                            }, this),
                                                            " Current shoe"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/input/page.tsx",
                                                        lineNumber: 278,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "flex items-center gap-1",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "w-2 h-2 rounded-full bg-neon-blue inline-block"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/input/page.tsx",
                                                                lineNumber: 282,
                                                                columnNumber: 23
                                                            }, this),
                                                            " Your preference"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/input/page.tsx",
                                                        lineNumber: 281,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/input/page.tsx",
                                                lineNumber: 277,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/input/page.tsx",
                                        lineNumber: 261,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/input/page.tsx",
                                    lineNumber: 260,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>router.push("/explore"),
                                    className: "w-full bg-neon-blue text-white py-3 text-sm font-medium hover:opacity-90 transition-all duration-300 rounded-lg shadow-sm flex items-center justify-center gap-2",
                                    children: "Explore Shoe Space"
                                }, void 0, false, {
                                    fileName: "[project]/app/input/page.tsx",
                                    lineNumber: 289,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/input/page.tsx",
                            lineNumber: 210,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/input/page.tsx",
                    lineNumber: 69,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/input/page.tsx",
            lineNumber: 60,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/input/page.tsx",
        lineNumber: 59,
        columnNumber: 5
    }, this);
}
_s(InputPage, "gMjHNkhj6G1PPe2ScoGs/3+9FTg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useShoeData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useShoeData"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useRunnerProfile$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRunnerProfile"]
    ];
});
_c = InputPage;
var _c;
__turbopack_refresh__.register(_c, "InputPage");

})()),
"[project]/app/input/page.tsx [app-rsc] (ecmascript, Next.js server component, client modules)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname }) => (() => {


})()),
}]);

//# sourceMappingURL=_fb3f52._.js.map