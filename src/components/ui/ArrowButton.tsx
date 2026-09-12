type ArrowButtonProps = {
  variant?: "dark" | "light" | "lime" | "outline-light";
  size?: number;
  direction?: "right" | "up-right";
  className?: string;
  href?: string;
  /** Invert/animate when an ancestor with the `group` class is hovered, instead of only on its own hover. */
  groupHover?: boolean;
};

const VARIANT_CLASSES: Record<NonNullable<ArrowButtonProps["variant"]>, string> = {
  dark: "bg-dark-surface text-white",
  light: "bg-white text-ink",
  lime: "bg-lime-bright text-ink",
  "outline-light": "border-2 border-white bg-transparent text-white",
};

const DARK_INVERT_OWN = "transition-colors duration-300 hover:bg-white hover:text-dark-surface";
const DARK_INVERT_GROUP = "transition-colors duration-500 group-hover:bg-white group-hover:text-dark-surface";
const LIME_PULSE_GROUP = "transition-transform duration-300 group-hover:scale-110";

export function ArrowButton({
  variant = "light",
  size = 51,
  direction = "right",
  className = "",
  href,
  groupHover = false,
}: ArrowButtonProps) {
  let interactive = "";
  if (variant === "dark") interactive = groupHover ? DARK_INVERT_GROUP : DARK_INVERT_OWN;
  if (variant === "lime" && groupHover) interactive = LIME_PULSE_GROUP;

  const classes = `inline-flex shrink-0 items-center justify-center rounded-full ${VARIANT_CLASSES[variant]} ${interactive} ${className}`;
  const style = { width: size, height: size, fontSize: size * 0.37 };
  const glyph = direction === "right" ? "→" : "↗";

  if (href) {
    return (
      <a href={href} className={classes} style={style} aria-label="Подробнее">
        {glyph}
      </a>
    );
  }

  return (
    <span className={classes} style={style} aria-hidden="true">
      {glyph}
    </span>
  );
}
