import React from 'react';
import {
  Box,
  Typography,
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export const HomeAccordion = () => {
  const [expanded, setExpanded] = React.useState<string | false>(false);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  return (
    <Box
      sx={{
        width: '90%',
        backgroundColor: '#C8CBE8',
        padding: 2.5,
        borderRadius: '15px',
      }}
    >
      <Accordion
        expanded={expanded === 'panel1'}
        onChange={handleChange('panel1')}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography variant="subtitle1" sx={{ width: '100%', flexShrink: 0 }}>
            What is Revue.Studio?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2">
            Revue is going to be a file storage, sharing, video project
            management app, made especially for video production studios and
            professionals.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === 'panel2'}
        onChange={handleChange('panel2')}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2bh-content"
          id="panel2bh-header"
        >
          <Typography variant="subtitle1" sx={{ width: '100%', flexShrink: 0 }}>
            Why should I use Revue when I already have other similar services?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2">
            Our vision for Revue is to build an app where video production
            professionals can use one place for many core functionalities
            similar services, such as file storage, sharing, and video
            collaboration.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === 'panel3'}
        onChange={handleChange('panel3')}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3bh-content"
          id="panel3bh-header"
        >
          <Typography variant="subtitle1" sx={{ width: '100%', flexShrink: 0 }}>
            When will Revue.Studio will ready?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2">
            Soon! We are working on this as good and as quickly we can. A lot of
            time and dedication need to be spent on making this app as efficient
            as possible to offer a comprehensive service at a competitive price
            point for video professionals.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === 'panel4'}
        onChange={handleChange('panel4')}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel4bh-content"
          id="panel4bh-header"
        >
          <Typography variant="subtitle1" sx={{ width: '100%', flexShrink: 0 }}>
            What is Revue.Studio trying to accomplish?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2">
            Our goal is to make life easier for video professionals around the
            world. One app to replace all of your other cloud based apps,
            decreasing your cost and save you hassle.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default HomeAccordion;
