import React, { useState } from 'react';
import { Tabs, Tab, Box, Typography } from '@mui/material';

const ManagerReportsPage = () => {
    const [activeTab, setActiveTab] = useState(0);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 0:
                return <Typography>Product Usage Chart Content</Typography>;
            case 1:
                return <Typography>X Report Content</Typography>;
            case 2:
                return <Typography>Z Report Content</Typography>;
            case 3:
                return <Typography>Sales Report Content</Typography>;
            default:
                return null;
        }
    };

    return (
        <Box sx={{ width: '100%', padding: 2 }}>
            <Tabs
                value={activeTab}
                onChange={handleTabChange}
                indicatorColor="primary"
                textColor="primary"
                variant="fullWidth"
            >
                <Tab label="Product Usage Chart" />
                <Tab label="X Report" />
                <Tab label="Z Report" />
                <Tab label="Sales Report" />
            </Tabs>
            <Box sx={{ marginTop: 2 }}>
                {renderTabContent()}
            </Box>
        </Box>
    );
};

export default ManagerReportsPage;