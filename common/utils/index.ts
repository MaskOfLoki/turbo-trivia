import { GradientType, GradientDirection, IGradientStep } from '../types/Gradients';
import { ColorValue } from '../types/Color';
import { IQuestion } from '../common';
import { isEmptyString } from '@gamechangerinteractive/xc-backend/utils';

export function isEmptyObject(value: Record<string, any>): boolean {
  for (const key in value) {
    if (Object.prototype.hasOwnProperty.call(value, key)) return false;
  }
  return true;
}

export function buildGradientString({
  type,
  direction,
  steps,
}: {
  type: GradientType;
  direction: GradientDirection;
  steps: IGradientStep[];
}): string {
  let value = '';
  if (steps.length > 1) {
    const gtype = getGradientType(type);
    const dirStr = getGradientDirection(type, direction);
    const stepStr = getIGradientSteps(steps);
    value = `${gtype}(${dirStr},${stepStr})`;
  } else {
    value = steps[0].color;
  }

  return value;
}

function getGradientType(type: GradientType): string {
  switch (type) {
    case GradientType.Linear:
      return 'linear-gradient';
    default:
      return 'radial-gradient';
  }
}

function getGradientDirection(type: GradientType, direction: GradientDirection): string {
  switch (type) {
    case GradientType.Circular:
      return `circle ${direction}`;
    default:
      return direction;
  }
}

function getIGradientSteps(steps: IGradientStep[]): string {
  return steps.map((step) => `${step.color} ${step.position}%`).join(',');
}

export function getColor(value: ColorValue): string {
  if (typeof value === 'string') {
    return value;
  }

  const temp = value;

  if (temp.generatedStyle) {
    return temp.generatedStyle;
  }

  return (temp.generatedStyle = buildGradientString(temp));
}

export function removeNulls(value) {
  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      if (value[i] == null) {
        value.splice(i, 1);
        i--;
      }
    }
  }

  if (typeof value !== 'object') {
    return;
  }

  for (const s in value) {
    if (value[s] == null) {
      delete value[s];
    } else {
      removeNulls(value[s]);
    }
  }
}

export function getFieldValue<T, S>(target: T, field: string): S {
  const fieldParts = field.split('.');
  let fieldValue: any = target;

  while (fieldParts.length > 0) {
    const fieldPart = fieldParts.shift();

    if (fieldValue[fieldPart] == null) {
      fieldValue = undefined;
      break;
    }

    fieldValue = fieldValue[fieldPart];
  }

  return fieldValue;
}

export function buildObjectByFieldValue<T, S>(field: string, value: S) {
  const fieldParts = field.split('.');
  const obj = {};
  let objPart = obj;

  while (fieldParts.length > 1) {
    const fieldPart = fieldParts.shift();
    objPart = objPart[fieldPart] = {};
  }

  objPart[fieldParts.shift()] = value;
  return obj;
}

export function deepSet(path: string, target, value) {
  const keys = path.split('.');

  let current = target;

  while (keys.length) {
    const key = keys.shift();
    if (!keys.length) {
      current[key] = value;
      break;
    } else if (typeof current[key] !== 'object') {
      current[key] = {};
    }
    current = current[key];
  }
}

export function numberWithCommas(x: number): string {
  if (x == null) {
    return '';
  }

  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function getMediaType(url) {
  if (!url) {
    return null;
  }

  if (url.match(/\.(jpeg|jpg|gif|png)/) != null) {
    return 'image';
  } else if (url.match(/\.(mp4)/) != null) {
    return 'video';
  } else if (url.match(/\.(mp3)/) != null) {
    return 'audio';
  }
}

export function getFileExtension(url: string): string {
  return url.split(/[#?]/)[0].split('.').pop().trim();
}

export function isImageBasedQuestion(question: IQuestion) {
  const answer = question?.answers[0];
  return !isEmptyString(answer?.image);
}

export function getWeeklyLeaderboard(): string {
  const now = new Date();
  const jan1 = new Date(now.getFullYear(), 0, 1);
  const weekNumber = Math.ceil(((now.getTime() - jan1.getTime()) / 86400000 + jan1.getDay() + 1) / 7);
  return `${now.getFullYear()}-${weekNumber}`;
}

export function formatTime(time: number) {
  time = Math.floor(time * 0.001);
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time - minutes * 60);
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}
