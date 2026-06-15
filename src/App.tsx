import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { SiteLayout } from './components/SiteLayout';
import { NotFoundBlock } from './components/Blocks';
import {
  AboutPage,
  AktuelltPage,
  DistrictDetailPage,
  DistrictsPage,
  DonatePage,
  ElectionHubPage,
  EventsPage,
  FreeStudentsPage,
  GranskningPage,
  HomePage,
  KommunobligationerPage,
  LeaderWordPage,
  LegalPage,
  MembershipPage,
  MunicipalityDetailPage,
  PeoplePage,
  PersonDetailPage,
  PodcastPage,
  PolicyDetailPage,
  PoliticsPage,
  PostDetailPage,
  PressPage,
  RedirectToPolitics,
  RedirectToPost,
  RiksCandidatePage,
  RiksdagsListPage,
  SourcePage,
} from './pages/SitePages';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route index element={<HomePage />} />
          <Route path="val-2026" element={<ElectionHubPage />} />
          <Route path="politik" element={<PoliticsPage />} />
          <Route path="politik/lista" element={<RedirectToPolitics />} />
          <Route path="politik/sammanfattning" element={<RedirectToPolitics />} />
          <Route path="politik/partiprogram" element={<PoliticsPage />} />
          <Route path="politik/:slug" element={<PolicyDetailPage />} />
          <Route path="var-politik" element={<RedirectToPolitics />} />
          <Route path="politiker" element={<PeoplePage />} />
          <Route path="politiker/:slug" element={<PersonDetailPage />} />
          <Route path="riksdagslistan" element={<RiksdagsListPage />} />
          <Route path="riksdagslistan/:slug" element={<RiksCandidatePage />} />
          <Route path="distrikt" element={<DistrictsPage />} />
          <Route path="distrikt/:districtSlug" element={<DistrictDetailPage />} />
          <Route path="distrikt/:districtSlug/:municipalitySlug" element={<MunicipalityDetailPage />} />
          <Route path="evenemang" element={<EventsPage />} />
          <Route path="evenemang/:slug" element={<PostDetailPage kind="event" />} />
          <Route path="aktuellt" element={<AktuelltPage />} />
          <Route path="aktuellt/:slug" element={<PostDetailPage kind="news" />} />
          <Route path="pressmeddelande" element={<RedirectToPost />} />
          <Route path="pressmeddelande/:slug" element={<PostDetailPage kind="news" />} />
          <Route path="om" element={<AboutPage />} />
          <Route path="partiledare-har-ordet" element={<LeaderWordPage />} />
          <Route path="press" element={<PressPage />} />
          <Route path="alla-ska-med" element={<PodcastPage />} />
          <Route path="granskningsgruppen" element={<GranskningPage />} />
          <Route path="donera" element={<DonatePage />} />
          <Route path="medlemskap" element={<MembershipPage />} />
          <Route path="bli-medlem" element={<MembershipPage />} />
          <Route path="kommunobligationer" element={<KommunobligationerPage />} />
          <Route path="fria-studenter" element={<FreeStudentsPage />} />
          <Route path="integritetspolicy" element={<LegalPage page="integritetspolicy" />} />
          <Route path="cookiepolicy" element={<LegalPage page="cookiepolicy" />} />
          <Route path="source" element={<SourcePage />} />
          <Route path="*" element={<NotFoundBlock />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
