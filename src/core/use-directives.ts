import { useState } from "react";
import type { Directive } from "./directive";
import type { SelectedDirectives } from "./selected-directives";

export function useDirectives() {
  const [selectedDirectives, setSelectedDirectives] =
    useState<SelectedDirectives>({});

  function handleChangeDirective(
    directive: Directive,
    value: boolean | string
  ) {
    setSelectedDirectives((prev) => {
      const next = { ...prev };

      if (value === "" || value === false) {
        delete next[directive.name];
        return next;
      }

      if (directive.type === "boolean") {
        next[directive.name] = true;
        return next;
      }

      next[directive.name] = value;
      return next;
    });
  }

  return { selectedDirectives, handleChangeDirective };
}
