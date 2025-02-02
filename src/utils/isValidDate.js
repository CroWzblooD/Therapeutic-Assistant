export const isValidDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        return false;
    } else {
        const inputParts = dateString.split('-');
        if (inputParts.length === 3) {
            const year = date.getFullYear().toString();
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');

            return inputParts[0] === year && inputParts[1] === month && inputParts[2] === day;
        } else {
            return false;
        }
    }
}