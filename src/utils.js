export function isEmail(str) {
  return /.+@.+\..+/.test(str);
}

function pluralize(time, label) {
  if (time === 1) {
    return time + label;
  }
  return `${time}${label}s`;
}

export function timeAgo(time) {
  const { floor } = Math;
  const between = (Date.now() / 1000) - Number(time);
  if (between < 3600) {
    return pluralize(floor(between / 60), ' minute');
  } else if (between < 86400) {
    return pluralize(floor(between / 3600), ' hour');
  }

  return pluralize(floor(between / 86400), ' day');
}
