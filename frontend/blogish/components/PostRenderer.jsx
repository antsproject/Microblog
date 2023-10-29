import React from 'react';

const PostRenderer = ({ data }) => {
    const renderContent = (item) => {
        switch (item.type) {
            case 'heading':
                const HeadingComponent = `h${item.props.level}`;

                return (
                    <div>
                        {item.content &&
                            item.content.map((contentItem) => (
                                <HeadingComponent>
                                    <span
                                        key={contentItem.id + '-head'}
                                        style={{ ...contentItem.styles }}
                                    >
                                        {contentItem.text}
                                    </span>
                                </HeadingComponent>
                            ))}
                    </div>
                );
            case 'paragraph':
                return (
                    <p>
                        {item.content &&
                            item.content.map((contentItem) => (
                                <span
                                    key={contentItem.id + '-par'}
                                    style={{ ...contentItem.styles }}
                                    className="render-text"
                                >
                                    {contentItem.text}
                                </span>
                            ))}
                    </p>
                );
            case 'bulletListItem':
                return (
                    <ul>
                        <li>
                            {item.content &&
                                item.content.map((contentItem) => (
                                    <span
                                        key={contentItem.id + '-bullList'}
                                        style={contentItem.styles}
                                    >
                                        {contentItem.text}
                                    </span>
                                ))}
                        </li>
                    </ul>
                );
            case 'numberedListItem':
                return (
                    <ol>
                        <li>
                            {item.content &&
                                item.content.map((contentItem) => (
                                    <span
                                        key={contentItem.id + '-numList'}
                                        style={contentItem.styles}
                                    >
                                        {contentItem.text}
                                    </span>
                                ))}
                        </li>
                    </ol>
                );
            default:
                return null;
        }
    };

    const renderNestedContent = (items, level = 0) => {
        return (
            <div>
                {items?.map((item) => (
                    <div key={item.id} style={{ marginLeft: `${level * 20}px` }}>
                        <pre>{renderContent(item)}</pre>
                        {item.children && item.children.length > 0 && (
                            <div key={item.id + '-children'}>
                                {renderNestedContent(item.children, level + 1)}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        );
    };

    return <div>{renderNestedContent(data)}</div>;
};

export default PostRenderer;
