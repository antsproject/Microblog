// const ContentRenderer = ({content}) => {
//     return JSON.parse(content).content
// }

const ContentRenderer = ({content}) => {
    if (!content[0]) {
        return <div>No Content content</div>
    }

    return (
        <div>
            {content.map((item) => (
                <div key={item.id} style={{textAlign: item.props.textAlignment}}>
                    {item.content.map((contentItem, index) => (
                        <div key={item.id + '_' + index} style={contentItem.styles}>
                            {contentItem.text}
                        </div>
                    ))}
                    <ContentRenderer content={item.children}/>
                </div>
            ))}
        </div>
    );

};


export default ContentRenderer;