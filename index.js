const Queue = require('bull');


const m_queues = new Map()


const create_m_queue = ({ meetingId }) => {

    const m_queue = new Queue(`meeting_${meetingId}`, { redis: { port: "7001", host: "127.0.0.1" } })

    m_queue.process(function (job, done) {

        setTimeout(() => {
            console.log(job.data.index)
            done()

        }, job.data.timeout);

    })

    // m_queue.on("")

    return m_queue
}

const add_m_queue = ({ meetingId, m_queue, timeout, index }) => {

    console.log("add_m_queue", meetingId, index)

    m_queue.add({ timeout, meetingId, index })



}

const handleJoinReq = ({ meetingId, timeout, index }) => {



    const m_queue = m_queues.get(meetingId)


    if (m_queue) {

        add_m_queue({ m_queue, meetingId, timeout, index })

    } else {
        const new_m_queue = create_m_queue({ meetingId })

        add_m_queue({ m_queue: new_m_queue, meetingId, timeout, index })

        m_queues.set(meetingId, new_m_queue)

    }

}

const meetingIds = ["111-111-111", "222-222-222", "333-333-333"]




for (let index = 0; index < 21; index++) {

    const div = index - (parseInt(index / 3) * 3)

    const meetingId = meetingIds[div]

    handleJoinReq({ meetingId, timeout: 5000, index })

}

// setTimeout(() => {
//     console.log("done")
// }, 21 / 3 * 5000)