export const millisecondsToHuman = (lastOnline) => {
    const minutesSinceOnline = Math.floor((Date.now() - lastOnline) / 1000 / 60)
    // console.log(minutesSinceOnline)
    switch (true) {
        case (minutesSinceOnline < 2): {
            return 'last seen just now'
        }
        case (minutesSinceOnline < 60): {
            return `last seen ${minutesSinceOnline} minutes ago`
        }
        case (Math.floor(minutesSinceOnline / 60) === 1): {
            return `last seen an hour ago`
        }
        case (minutesSinceOnline <= 60 * 24): {
            return `last seen ${Math.floor(minutesSinceOnline / 60)} hours ago`
        }
        case (Math.floor(minutesSinceOnline / 60 / 24) === 1): {
            return 'last seen yesterday'
        }
        case (Math.floor(minutesSinceOnline / 60 / 24) < 7): {
            return `last seen ${Math.floor(minutesSinceOnline / 60 / 24)} days ago`
        }
        case (Math.floor(minutesSinceOnline / 60 / 24) === 7): {
            return 'last seen a week ago'
        }
        default: return `last seen on ${new Date(+lastOnline).toLocaleString('en', {
            hour12: false,
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        })}`
    }
}