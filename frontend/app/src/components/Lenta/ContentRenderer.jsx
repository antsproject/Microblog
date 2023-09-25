const ContentRenderer = ({content}) => {
    return (
        <div>
            {content.map((item) => (
                <div key={item.id} style={{textAlign: item.props.textAlignment}}>
                    {item.content.map((contentItem) => (
                        <div key={contentItem.id} style={contentItem.styles}>
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