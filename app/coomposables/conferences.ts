export const useConferences = () => {
    const conferenceLink = (conference: Conference): string => `/conference/${conference.id}`

    const findConference = (id: string, conferences?: Conference[]): Conference | undefined => {
        if (conferences === undefined) {
            return undefined;
        }

        return conferences.find((conference) => {
            return conference.id === id
        })
    }


    return {
        conferenceLink,
        findConference
    }
}