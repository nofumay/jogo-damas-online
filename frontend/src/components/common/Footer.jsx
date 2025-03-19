import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Container, Typography, Link, Grid, Divider } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box component="footer" sx={{ 
      bgcolor: 'primary.main', 
      color: 'primary.contrastText', 
      py: 3, 
      mt: 'auto' 
    }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Damas Online
            </Typography>
            <Typography variant="body2">
              O melhor jogo de damas online, com jogadores de todo o mundo.
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Links Úteis
            </Typography>
            <Link component={RouterLink} to="/" color="inherit" display="block" sx={{ mb: 1 }}>
              Início
            </Link>
            <Link component={RouterLink} to="/register" color="inherit" display="block" sx={{ mb: 1 }}>
              Cadastre-se
            </Link>
            <Link component={RouterLink} to="/login" color="inherit" display="block" sx={{ mb: 1 }}>
              Login
            </Link>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Sobre
            </Typography>
            <Link href="https://github.com/nofumay/jogo-damas-online" target="_blank" rel="noopener" color="inherit" display="flex" alignItems="center" sx={{ mb: 1 }}>
              <GitHubIcon sx={{ mr: 1 }} />
              GitHub
            </Link>
            <Typography variant="body2">
              Jogo desenvolvido como projeto de demonstração.
            </Typography>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 2, bgcolor: 'rgba(255, 255, 255, 0.2)' }} />
        
        <Typography variant="body2" align="center">
          © {currentYear} Damas Online. Todos os direitos reservados.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;