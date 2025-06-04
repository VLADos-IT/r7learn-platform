import { getUser } from './user.js';

export function getProgressForUnit(unitId, courseUnits, progressList) {
    const user = getUser();
    if (!user || user.role === 'guest') return null;
    const unit = courseUnits.find(u => u.id === unitId);
    const found = progressList.find(p => p.courseUnitId === unitId);
    if (unit && unit.courseUnitTypeName === 'test') {
        return found ? 100 : 0;
    }
    if (!unit || !found || !unit.maxDegree || unit.maxDegree === 0) return 0;
    return Math.round((found.degree / unit.maxDegree) * 100);
}