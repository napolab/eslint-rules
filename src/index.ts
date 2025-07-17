import { rule as enforceLayoutComponentName } from "./rules/enforce-layout-component-name/index.js";
import { rule as enforcePageComponentName } from "./rules/enforce-page-component-name/index.js";
import { rule as enforceStyling } from "./rules/enforce-styling/index.js";
import { rule as maxStyleNameWords } from "./rules/max-style-name-words/index.js";
import { rule as noChildSelectors } from "./rules/no-child-selectors/index.js";
import { rule as noContainerWrapperNames } from "./rules/no-container-wrapper-names/index.js";
import { rule as preferArrayAt } from "./rules/prefer-array-at/index.js";
import { rule as requireUseeffectComment } from "./rules/require-useeffect-comment/index.js";

export default {
  rules: {
    "no-container-wrapper-names": noContainerWrapperNames,
    "no-child-selectors": noChildSelectors,
    "max-style-name-words": maxStyleNameWords,
    "enforce-styling": enforceStyling,
    "enforce-layout-component-name": enforceLayoutComponentName,
    "enforce-page-component-name": enforcePageComponentName,
    "prefer-array-at": preferArrayAt,
    "require-useeffect-comment": requireUseeffectComment,
  },
};
