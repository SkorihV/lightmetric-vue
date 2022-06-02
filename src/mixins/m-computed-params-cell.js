export default {
    methods: {
        updateColor() {
            let localMinimal        = null;
            let localNormal         = null;
            let localValueOutput    = null;
            if (this.isDateTime(this.minimal) && this.isDateTime(this.normal) && this.isDateTime(this.defineValueInInputData)) {
                localMinimal = this.getDateTime(this.minimal);
                localNormal = this.getDateTime(this.normal);
                localValueOutput = this.getDateTime(this.defineValueInInputData);
            }

            if ( this.minimal && this.normal &&  this.defineValueInInputData.replace(/ /g, "") !== '' && localValueOutput instanceof Date) {
                if (localMinimal < localNormal) {
                    if (localValueOutput < localMinimal) {
                        return 'bad-cell';
                    } else if (localValueOutput >= localMinimal && localValueOutput < localNormal) {
                        return 'normal-cell';
                    } else {
                        return 'good-cell';
                    }
                } else if (localMinimal >= localNormal) {
                    if (localValueOutput <= localNormal) {
                        return 'good-cell';
                    } else if (localValueOutput > localNormal && localValueOutput <= localMinimal) {
                        return 'normal-cell';
                    } else {
                        return 'bad-cell';
                    }
                }
            } else if ( this.minimal && this.normal &&  this.defineValueInInputData.replace(/ /g, "") !== '' && !(localValueOutput instanceof Date) ) {
                localMinimal = Number(parseFloat(this.minimal).toFixed(2));
                localNormal = Number(parseFloat(this.normal).toFixed(2));
                localValueOutput = Number(parseFloat(this.defineValueInInputData).toFixed(2));

                if (localMinimal < localNormal) {
                    if (localValueOutput < localMinimal) {
                        return 'bad-cell';
                    } else if (localValueOutput >= localMinimal && localValueOutput < localNormal) {
                        return 'normal-cell';
                    } else {
                        return 'good-cell';
                    }
                } else if (localMinimal >= localNormal) {
                    if (localValueOutput <= localNormal) {
                        return 'good-cell';
                    } else if (localValueOutput > localNormal && localValueOutput <= localMinimal) {
                        return 'normal-cell';
                    } else {
                        return 'bad-cell';
                    }
                }
            } else if(!localMinimal && !localNormal) {
                return '';
            }
        },

        getDateTime(time) {
            time = time.split(":");
            time = new Date(2021,0,0,time[0],time[1],time[2]||0);
            return time;
        },

        isDateTime(value){
            if (value === false || value === '') {return false}
            return  value.toString().match('[0-9]+:[0-5][0-9](:[0-5][0-9])?') !== null;

        },

        around(value) {
            if(this.isAround === '1' ) {
                value =   parseFloat(value).toFixed(2);
            } else if (this.isAround  === '0') {
                value =   parseInt(value).toFixed(0);
            }
            return value
        },

        separatorThousands(value) {
            let parts = value.toString().split(".");
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
            return parts.join(".");
        }
    }
}