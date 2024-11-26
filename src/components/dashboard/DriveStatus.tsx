import { LeftCircleFilled, RightCircleFilled } from '@ant-design/icons';
import { Button, Card, Carousel, Empty, List, Progress, ProgressProps, Tag,Typography } from 'antd'
import React from 'react'

const {Text} = Typography
// export const DriveStatus = ({ driveData, handleCardClick,handleRefresh }) => {
export const DriveStatus = ({ driveData, handleCardClick,fetchFilesInFolder,reloadFolder }) => {
    const carouselSettings = {
        dots: true,
        infinite: true,
        slidesToShow: 4,
        slidesToScroll: 1,
        prevArrow: <CustomPrevArrow />,
        nextArrow: <CustomNextArrow />,
        // centerMode: true,
        // centerPadding: '10px', // Adds padding
        responsive: [
            { breakpoint: 1200, settings: { slidesToShow: 3 } },
            { breakpoint: 992, settings: { slidesToShow: 2 } },
            { breakpoint: 768, settings: { slidesToShow: 1 } }
        ]
    };

    const conicColors: ProgressProps['strokeColor'] = {
        '0%': '#87d068',
        '50%': '#ffe58f',
        '100%': '#ffccc7',
    };

    // if(!driveData)
    //     return (
    //         <div style={{background:"rgba(180,180,180,0.2)"}}>
    //             <Empty />
    //         </div>
    //     )
    return (
        <Carousel {...carouselSettings} arrows   >
            
            {driveData.map((drive, index) => (
             
                <Card  
                    key={index}
                    
                    bordered={true}
                    onClick={() => handleCardClick(drive.id)}
                    hoverable
                    title={`${drive.email}`}
                                        >
                    

                    {drive.usage &&(
                        <>
                            <Text>
                                {/* <strong>Usage:</strong>  */}
                                
                                {drive.usage.usedStorage} / {drive.usage.totalStorage} used
                            </Text>
                            
                            <Progress percent={parseFloat(drive.usage.usagePercentage)} status="active" strokeColor={conicColors}/>
                            <p>
                                {drive.isPublic ? <Tag color="green">Public</Tag> : <Tag color="red">Private</Tag>}
                                {drive.provider ==="google" && <Tag color="blue"><strong>{drive.provider}</strong></Tag>}
                                {drive.provider ==="dropbox" && <Tag color="magenta"><strong>{drive.provider}</strong></Tag>}

                            </p>
                        
                            {/* Add the refresh button */}
                            {/* <Button onClick={() =>fetchFilesInFolder(drive.id, '', '', false)} type="primary" size="small"> */}
                            <Button onClick={() =>reloadFolder()} type="primary" size="small" style={{marginTop:20}}>
                                Refresh
                            </Button>
                        </>
                    )}
                   
                </Card>
            ))
            }

        </Carousel>
    )
}


const CustomPrevArrow = (props) => {
    const { className, style, onClick } = props;
    return (
        <LeftCircleFilled
            className={className}
            style={{ ...style, fontSize: "24px", color: "#000", left: '-20px', zIndex: 1 }}
            onClick={onClick}
        />
    );
};

const CustomNextArrow = (props) => {
    const { className, style, onClick } = props;
    return (
        <RightCircleFilled
            className={className}
            style={{ ...style, fontSize: "24px", color: "#000", right: '-20px', zIndex: 1 }}
            onClick={onClick}
        />
    );
};


