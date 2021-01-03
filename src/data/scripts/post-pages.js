module.exports = {
    run: function(data) {
        return {
            pages: data.rows.map(item => {
                return {
                    pageId: item.post_id,
                    ...item
                }
            })
        }
    }
}
