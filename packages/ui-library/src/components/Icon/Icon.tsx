// packages/ui-library/src/components/Icon/Icon.tsx
import React from "react";

export type IconDefinition = {
  iconName?: string;
};

export type IconProps = React.SVGAttributes<SVGSVGElement> & {
  icon?: IconDefinition | string;
  title?: string;
};

export const Icon = ({ icon, title, ...props }: IconProps) => {
  const iconName = typeof icon === "string" ? icon : icon?.iconName;

  return (
    <svg viewBox="0 0 24 24" aria-hidden={title ? undefined : true} role={title ? "img" : undefined} focusable="false" {...props}>
      {title && <title>{title}</title>}
      {iconName === "search" ? (
        <path
          d="M10.5 4a6.5 6.5 0 0 1 5.15 10.46l4.45 4.44-1.2 1.2-4.44-4.45A6.5 6.5 0 1 1 10.5 4Zm0 1.7a4.8 4.8 0 1 0 0 9.6 4.8 4.8 0 0 0 0-9.6Z"
          fill="currentColor"
        />
      ) : (
        <path d="M12 3.5 20.5 12 12 20.5 3.5 12 12 3.5Zm0 4.2L7.7 12l4.3 4.3 4.3-4.3L12 7.7Z" fill="currentColor" />
      )}
    </svg>
  );
};
