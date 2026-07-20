import { motion } from 'framer-motion';

/**
 * ScrollFade Component
 * Provides smooth fade-in / fade-out animations on scroll powered by Framer Motion.
 */
export default function ScrollFade({
  children,
  direction = 'up', // 'up' | 'down' | 'left' | 'right' | 'scale' | 'none'
  delay = 0,
  duration = 0.6,
  distance = 35,
  once = false, // false = smooth fade in when entering viewport & fade out when exiting
  amount = 0.15,
  viewportMargin = '0px',
  className = '',
  style = {},
  as = 'div',
  ...props
}) {
  const Component = motion[as] || motion.div;

  const getInitialState = () => {
    const state = { opacity: 0 };
    switch (direction) {
      case 'up':
        state.y = distance;
        break;
      case 'down':
        state.y = -distance;
        break;
      case 'left':
        state.x = distance;
        break;
      case 'right':
        state.x = -distance;
        break;
      case 'scale':
        state.scale = 0.92;
        break;
      case 'none':
      default:
        break;
    }
    return state;
  };

  const getInViewState = () => {
    return {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
    };
  };

  return (
    <Component
      initial={getInitialState()}
      whileInView={getInViewState()}
      viewport={{
        once,
        amount,
        margin: viewportMargin,
      }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
      style={style}
      {...props}
    >
      {children}
    </Component>
  );
}

/**
 * ScrollStaggerContainer Component
 * Parent container for stagger animating multiple children on scroll.
 */
export function ScrollStaggerContainer({
  children,
  staggerChildren = 0.1,
  delayChildren = 0,
  once = false,
  amount = 0.15,
  viewportMargin = '0px',
  className = '',
  as = 'div',
  ...props
}) {
  const Component = motion[as] || motion.div;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren,
        delayChildren,
      },
    },
  };

  return (
    <Component
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{
        once,
        amount,
        margin: viewportMargin,
      }}
      className={className}
      {...props}
    >
      {children}
    </Component>
  );
}

/**
 * ScrollStaggerItem Component
 * Child element inside ScrollStaggerContainer.
 */
export function ScrollStaggerItem({
  children,
  direction = 'up',
  distance = 30,
  duration = 0.5,
  className = '',
  as = 'div',
  ...props
}) {
  const Component = motion[as] || motion.div;

  const getOffset = () => {
    switch (direction) {
      case 'up':
        return { y: distance };
      case 'down':
        return { y: -distance };
      case 'left':
        return { x: distance };
      case 'right':
        return { x: -distance };
      case 'scale':
        return { scale: 0.92 };
      default:
        return {};
    }
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      ...getOffset(),
    },
    show: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      transition: {
        duration,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <Component variants={itemVariants} className={className} {...props}>
      {children}
    </Component>
  );
}
